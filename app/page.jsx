'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardContainer from '@/components/DashboardContainer';
import NumericKeypadLogin from '@/components/NumericKeypadLogin';
import ParticipantPortal from '@/components/ParticipantPortal';

export default function Page() {
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [session, setSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [theme, setTheme] = useState('light');

  // 1. Inicializar tema y sesión persistida desde localStorage
  useEffect(() => {
    // Tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Sesión
    try {
      const savedSession = localStorage.getItem('tanda_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.role && parsed?.user) {
          setSession(parsed);
        }
      }
    } catch (e) {
      console.error('Error al recuperar sesión de localStorage:', e);
    }

    setIsInitialized(true);
  }, []);

  // 2. Función para alternar temas (Claro / Oscuro)
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

  // 3. Cargar datos del dashboard cuando hay sesión activa
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session, loadData]);

  // 4. Manejadores de Sesión
  const handleLoginSuccess = (authData) => {
    setSession(authData);
    localStorage.setItem('tanda_session', JSON.stringify(authData));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('tanda_session');
  };

  // Pantalla de carga mientras se lee localStorage
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // 5. Si no hay sesión iniciada, mostrar Login con Teclado Numérico
  if (!session) {
    return (
      <NumericKeypadLogin
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 6. Si hay sesión pero los datos están cargando o aún no están listos
  if (loadingData || !data) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-sm" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            {session.role === 'ADMIN' ? 'Cargando Dashboard de Carla...' : `Cargando Portal de ${session.user?.nombre || 'Participante'}...`}
          </p>
        </div>
      </div>
    );
  }

  // 7. Si es Administrador (Carla), mostrar Dashboard completo
  if (session.role === 'ADMIN') {
    return (
      <DashboardContainer
        initialData={data}
        onLogout={handleLogout}
      />
    );
  }

  // 8. Si es Participante, mostrar su Portal Personalizado
  if (session.role === 'PARTICIPANT') {
    const participant = data.participants?.find(
      (p) => String(p.id || '').trim().toUpperCase() === String(session.user?.id || '').trim().toUpperCase()
    );

    if (!participant) {
      return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 text-center shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-rose-500">Participante no encontrado</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No se encontraron registros activos correspondientes a tu usuario. Contacta a la administradora para verificar tu número de identificación.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      );
    }

    return (
      <ParticipantPortal
        participant={participant}
        allPayments={data.payments || []}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

