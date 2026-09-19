'use client';

import React from 'react';
import { 
  Smartphone, 
  Sun, 
  Moon, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowDownLeft, 
  ShieldCheck,
  Wallet,
  CreditCard
} from 'lucide-react';

export default function ParticipantPortal({ 
  participant, 
  allPayments = [], 
  theme, 
  toggleTheme, 
  onLogout 
}) {
  if (!participant) return null;

  // Filtrar los pagos que corresponden exclusivamente a este participante
  const myPayments = allPayments.filter(
    (p) => String(p.usuarioId || '').trim().toUpperCase() === String(participant.id || '').trim().toUpperCase()
  );

  const getStatusBadge = (estado) => {
    const est = (estado || '').toLowerCase();
    if (est.includes('adelantado')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Adelantado
        </span>
      );
    }
    if (est.includes('día') || est.includes('dia')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Al Día
        </span>
      );
    }
    const label = est.includes('mora') ? 'En Mora' : 'Atraso';
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <AlertTriangle className="w-3.5 h-3.5" /> {label}
      </span>
    );
  };

  const isEntregada = participant.estatusMoto?.toLowerCase().includes('entregada');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] pb-16 flex flex-col antialiased theme-transition">
      
      {/* Encabezado del Portal del Participante */}
      <header className="sticky top-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] px-4 py-3 theme-transition">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[var(--text-main)] flex items-center gap-1.5">
                Portal del Participante
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Tanda iPhone 18 Pro Max • Consulta Personal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Alternador de Tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] text-[var(--text-main)] active:scale-95 transition-all shadow-sm"
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-bold text-xs active:scale-95 transition-all shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal del Participante */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-6 space-y-6 animate-fadeIn">
        
        {/* Banner de Bienvenida Personalizado */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-sm theme-transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-input)] text-[var(--text-main)] font-black text-base flex items-center justify-center border border-[var(--border-main)] shrink-0">
              #{participant.noAsignado || participant.id}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                Bienvenido
              </span>
              <h2 className="text-xl font-black text-[var(--text-main)] leading-tight">
                {participant.nombre}
              </h2>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                ID de Usuario: <strong className="text-[var(--text-main)]">{participant.id}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center sm:justify-end">
            {getStatusBadge(participant.estado)}
          </div>
        </div>

        {/* Tarjeta 1: Mi iPhone 18 Pro Max */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-sm theme-transition space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-[var(--text-main)]">Mi iPhone 18 Pro Max</h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                isEntregada
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}
            >
              {participant.estatusMoto}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {participant.imagenMoto && (
              <div className="w-full md:w-56 h-44 rounded-2xl overflow-hidden border border-[var(--border-main)] bg-[var(--bg-input)] shrink-0 shadow-sm">
                <img
                  src={participant.imagenMoto}
                  alt={participant.modeloMoto}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="flex-1 w-full space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Modelo y Color Asignado</span>
                <div className="text-lg font-black text-[var(--text-main)]">{participant.modeloMoto}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-main)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold block mb-0.5">Fecha de Entrega Estimada</span>
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)] text-sm">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>{participant.fechaEntregaCalculada || 'Pendiente por definir'}</span>
                  </div>
                </div>

                <div className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-main)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold block mb-0.5">Estatus de Recepción del iPhone</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    {isEntregada ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Entregada ({participant.registroEntrega || 'Confirmada'})
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Pendiente de Entrega
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Progreso Financiero y Cuotas */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-sm theme-transition space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-[var(--text-main)]">Estado de Cuenta</h3>
            </div>
            <span className="text-xs font-bold text-emerald-500">
              {participant.porcentajeProgreso}% Pagado
            </span>
          </div>

          {/* Barra de Progreso */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Progreso hacia el monto total</span>
              <span className="text-[var(--text-main)] font-bold">
                ${participant.totalPagado?.toLocaleString('es-MX')} abonados
              </span>
            </div>
            <div className="w-full bg-[var(--bg-input)] h-3 rounded-full overflow-hidden p-0.5 border border-[var(--border-main)]">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
                style={{ width: `${participant.porcentajeProgreso}%` }}
              ></div>
            </div>
          </div>

          {/* Grilla de Métricas Financieras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-2xl border border-[var(--border-main)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block mb-1">Cuota Semanal</span>
              <div className="text-base font-black text-[var(--text-main)]">
                ${participant.cuotaSemanal?.toLocaleString('es-MX')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">por semana</span>
            </div>

            <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-2xl border border-[var(--border-main)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block mb-1">Total Pagado</span>
              <div className="text-base font-black text-emerald-500">
                ${participant.totalPagado?.toLocaleString('es-MX')}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">recaudación acumulada</span>
            </div>

            <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-2xl border border-[var(--border-main)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block mb-1">Deuda Restante</span>
              <div className={`text-base font-black ${participant.deudaTotal > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                ${participant.deudaTotal?.toLocaleString('es-MX')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">por completar</span>
            </div>

            <div className="bg-[var(--bg-card-subtle)] p-3.5 rounded-2xl border border-[var(--border-main)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block mb-1">Saldo / Diferencia</span>
              <div className={`text-base font-black ${participant.saldo < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                ${participant.saldo?.toLocaleString('es-MX')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {participant.saldo < 0 ? 'atraso actual' : 'al día / a favor'}
              </span>
            </div>
          </div>

          {/* Cuotas Completadas vs Vencidas */}
          <div className="flex items-center justify-between text-xs bg-[var(--bg-input)] p-3.5 rounded-2xl border border-[var(--border-main)]">
            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cuotas completadas: <strong className="text-[var(--text-main)] text-sm">{participant.cuotasCompletadas}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Vencidas: <strong className="text-[var(--text-main)] text-sm">{participant.cuotasVencidas}</strong></span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Mi Historial de Pagos Realizados */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-sm theme-transition space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-[var(--text-main)]">Mis Pagos Abonados</h3>
            </div>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              {myPayments.length} {myPayments.length === 1 ? 'abono registrado' : 'abonos registrados'}
            </span>
          </div>

          {myPayments.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-[var(--bg-input)] rounded-2xl border border-[var(--border-main)]">
              No tienes registros de abonos recientes en el sistema.
            </div>
          ) : (
            <div className="space-y-2">
              {myPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="bg-[var(--bg-card-subtle)] border border-[var(--border-main)] rounded-2xl p-3.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)] text-sm">
                        Abono Confirmado
                      </div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                        {pay.fecha || 'Sin fecha'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-500">
                      +${pay.monto?.toLocaleString('es-MX')}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">Abonado</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nota Informativa */}
        <div className="text-center py-3 text-xs text-[var(--text-muted)] font-medium">
          ¿Tienes dudas sobre tus abonos o fechas? Comunícate directamente con la administración de la tanda.
        </div>
      </main>
    </div>
  );
}
