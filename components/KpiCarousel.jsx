'use client';

import React from 'react';
import { Wallet, TrendingDown, Bike, UserCheck, ArrowUpRight } from 'lucide-react';

export default function KpiCarousel({ kpis }) {
  if (!kpis) return null;

  const {
    cajaTotal = 0,
    saldoActual = 0,
    proximoParticipante = 'N/A',
    proximaMoto = 'N/A',
    costoProximaMoto = 0,
    fondoProximaMoto = 0,
    faltante = 0,
    alDiaCount = 0,
    adelantadosCount = 0,
    enMoraCount = 0,
    semanaActual = 0,
    semanasRestantes = 0,
  } = kpis;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Métricas Globales (Semana {semanaActual})
        </h2>
        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {semanasRestantes} semanas restantes
        </span>
      </div>

      {/* Móvil: Swipe horizontal deslizable | Escritorio: Grilla de 4 columnas */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory space-x-3 md:space-x-0 gap-0 md:gap-4 no-scrollbar pb-2 pt-1 -mx-4 md:mx-0 px-4 md:px-0">
        
        {/* Tarjeta 1: Caja Total */}
        <div className="snap-align-start shrink-0 w-[240px] md:w-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-4 relative overflow-hidden shadow-sm theme-transition">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Caja Total</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] tracking-tight">
            ${cajaTotal.toLocaleString('es-MX')}
          </div>
          <div className="mt-2 text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Recaudación acumulada
          </div>
        </div>

        {/* Tarjeta 2: Fondo y Próximo iPhone */}
        <div className="snap-align-start shrink-0 w-[270px] md:w-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-4 relative overflow-hidden shadow-sm theme-transition">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Próxima Entrega</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-[var(--text-main)] truncate">
            {proximaMoto}
          </div>
          <div className="text-xs text-blue-500 font-semibold mb-2">
            Para: <span className="text-[var(--text-main)] font-bold">{proximoParticipante}</span>
          </div>

          {/* Barra de progreso de fondo */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-semibold">
              <span>Fondo: ${fondoProximaMoto.toLocaleString('es-MX')}</span>
              <span className="text-amber-500 font-bold">Falta: ${faltante.toLocaleString('es-MX')}</span>
            </div>
            <div className="w-full bg-[var(--bg-input)] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((fondoProximaMoto / (costoProximaMoto || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Saldo Actual */}
        <div className="snap-align-start shrink-0 w-[230px] md:w-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-4 relative overflow-hidden shadow-sm theme-transition">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Saldo Actual</span>
            <div className={`p-2 rounded-xl ${saldoActual < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${saldoActual < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            ${saldoActual.toLocaleString('es-MX')}
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-muted)] font-semibold">
            {saldoActual < 0 ? 'Déficit temporal acumulado' : 'Balance positivo'}
          </div>
        </div>

        {/* Tarjeta 4: Resumen de Mora */}
        <div className="snap-align-start shrink-0 w-[240px] md:w-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-4 relative overflow-hidden shadow-sm theme-transition">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Estado General</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-1.5">
              <div className="text-sm font-bold text-emerald-500">{adelantadosCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-bold truncate">Adelanto</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-1.5">
              <div className="text-sm font-bold text-blue-500">{alDiaCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-bold truncate">Al Día</div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-1.5">
              <div className="text-sm font-bold text-rose-500">{enMoraCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-bold truncate">En Mora</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
