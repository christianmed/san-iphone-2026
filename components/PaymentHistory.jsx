'use client';

import React, { useState } from 'react';
import { Search, Calendar, ArrowDownLeft } from 'lucide-react';

export default function PaymentHistory({ payments = [] }) {
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.usuarioId.toLowerCase().includes(search.toLowerCase())
  );

  const totalRecaudado = filteredPayments.reduce((acc, p) => acc + (p.monto || 0), 0);

  return (
    <div className="space-y-4">
      {/* Buscador de pagos */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar por usuario o participante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-input)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] rounded-xl pl-9 pr-4 py-2.5 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
        </div>

        {/* Resumen rápido */}
        <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-emerald-500 font-semibold">
          <span>Pagos filtrados: <strong>{filteredPayments.length}</strong></span>
          <span>Suma Total: <strong>${totalRecaudado.toLocaleString('es-MX')}</strong></span>
        </div>
      </div>

      {/* Lista de Transacciones de Pago */}
      <div className="space-y-2">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)]">
            No se encontraron registros de pago.
          </div>
        ) : (
          filteredPayments.map((pay) => (
            <div
              key={pay.id}
              className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-3.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition-colors shadow-sm theme-transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[var(--text-main)] text-sm flex items-center gap-2">
                    {pay.nombre}
                    <span className="text-[10px] text-[var(--text-muted)] font-bold bg-[var(--bg-input)] px-2 py-0.5 rounded-md border border-[var(--border-main)]">
                      {pay.usuarioId}
                    </span>
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
          ))
        )}
      </div>
    </div>
  );
}
