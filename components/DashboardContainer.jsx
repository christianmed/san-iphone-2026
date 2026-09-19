'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import KpiCarousel from './KpiCarousel';
import ParticipantAccordion from './ParticipantAccordion';
import PaymentHistory from './PaymentHistory';
import RegisterPaymentForm from './RegisterPaymentForm';
import RegisterDeliveryForm from './RegisterDeliveryForm';
import BottomNav from './BottomNav';

export default function DashboardContainer({ initialData, onLogout }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [theme, setTheme] = useState('light');

  // Cargar preferencia de tema guardada al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch (err) {
      console.error('Error al actualizar datos:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const { kpis, participants, payments } = data;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] pb-24 md:pb-12 flex flex-col antialiased theme-transition">
      
      {/* Encabezado Principal Responsivo */}
      <Header
        semanaActual={kpis?.semanaActual || 0}
        totalSemanas={kpis?.totalSemanas || 40}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Contenido Principal Adaptativo: Móvil max-w-md | Escritorio max-w-7xl */}
      <main className="flex-1 max-w-md md:max-w-7xl w-full mx-auto px-4 md:px-8 pt-6 space-y-8">
        
        {/* Vista: Resumen General / Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Carrusel / Grilla de Métricas Globales */}
            <KpiCarousel kpis={kpis} />

            {/* Layout de Escritorio: 2 Columnas (Izquierda: Participantes | Derecha: Registro de Pagos e Historial de 10) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Columna Principal: Participantes */}
              <div className="md:col-span-7 lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Participantes de la Tanda ({participants?.length || 0})
                  </h2>
                  <button
                    onClick={() => setActiveTab('participants')}
                    className="text-xs text-emerald-500 hover:underline font-bold"
                  >
                    Ver lista completa →
                  </button>
                </div>
                <ParticipantAccordion participants={participants} />
              </div>

              {/* Columna Secundaria: Formulario de Abono Rápido + Historial de 10 Pagos */}
              <div className="md:col-span-5 lg:col-span-5 space-y-8">
                
                {/* Módulo para Registrar Abono */}
                <RegisterPaymentForm
                  participants={participants}
                  onSuccess={handleRefresh}
                />

                {/* Panel de Pagos Recientes (Ampliado a 10 Pagos) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Últimos 10 Pagos Abonados
                    </h2>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-xs text-emerald-500 hover:underline font-bold"
                    >
                      Ver historial →
                    </button>
                  </div>
                  <PaymentHistory payments={payments?.slice(0, 10) || []} />
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Vista: Todos los Participantes */}
        {activeTab === 'participants' && (
          <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider px-1">
              Lista Completa de Participantes
            </h2>
            <ParticipantAccordion participants={participants} />
          </div>
        )}

        {/* Vista: Historial de Pagos */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider px-1">
              Registro Completo de Pagos
            </h2>
            <PaymentHistory payments={payments} />
          </div>
        )}

        {/* Vista: Pestaña Dedicada a Registrar Abono */}
        {activeTab === 'register' && (
          <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
            <RegisterPaymentForm
              participants={participants}
              onSuccess={() => {
                handleRefresh();
              }}
            />
          </div>
        )}

        {/* Vista: Pestaña Dedicada a Registrar Entrega de Moto */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
            <RegisterDeliveryForm
              participants={participants}
              onSuccess={() => {
                handleRefresh();
              }}
            />
          </div>
        )}

      </main>

      {/* Barra de Navegación Inferior (Sólo visible en móviles) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
