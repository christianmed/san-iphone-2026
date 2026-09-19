'use client';

import React, { useState } from 'react';
import { PackageCheck, Calendar, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck,  AlertTriangle } from 'lucide-react';

export default function RegisterDeliveryForm({ participants = [], onSuccess }) {
  const [selectedUser, setSelectedUser] = useState('');

  // Gestión de Fecha (Opción C)
  const getTodayFormatted = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return { dd, mm, yyyy: String(yyyy), formatted: `${dd}/${mm}/${yyyy}` };
  };

  const todayObj = getTodayFormatted();
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [day, setDay] = useState(todayObj.dd);
  const [month, setMonth] = useState(todayObj.mm);
  const [year, setYear] = useState(todayObj.yyyy);

  // Modal y Estados de Envío
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const selectedParticipantObj = participants.find((p) => p.id === selectedUser);
  const finalFecha = isCustomDate ? `${day}/${month}/${year}` : todayObj.formatted;

  const handleResetDateToToday = () => {
    const fresh = getTodayFormatted();
    setDay(fresh.dd);
    setMonth(fresh.mm);
    setYear(fresh.yyyy);
    setIsCustomDate(false);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedUser) {
      setFeedback({ type: 'error', message: 'Por favor selecciona un participante.' });
      return;
    }

    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: selectedParticipantObj.id,
          nombre: selectedParticipantObj.nombre,
          fechaEntrega: finalFecha,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setShowModal(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'Error al registrar la entrega.' });
        setShowModal(false);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error de red al intentar registrar la entrega.' });
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Encabezado del Módulo */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 shadow-sm theme-transition">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Registrar Entrega de iPhone</h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Actualización en tiempo real del estatus en Google Sheets
            </p>
          </div>
        </div>

        {/* Notificación Toast de Feedback */}
        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handlePreSubmit} className="mt-5 space-y-5">
          {/* 1. Selector de Participante */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Participante / Beneficiario
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-[var(--bg-input)] text-sm text-[var(--text-main)] rounded-xl px-3.5 py-3 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500 transition-colors shadow-sm font-medium cursor-pointer"
            >
              <option value="">-- Seleccionar Participante --</option>
              {participants.map((p) => {
                const isEntregada = p.estatusMoto?.toLowerCase().includes('entregada');
                return (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.nombre} ({p.modeloMoto}) [{isEntregada ? 'Entregada' : 'Pendiente'}]
                  </option>
                );
              })}
            </select>
          </div>

          {/* Tarjeta Informativa de la Moto al Seleccionar Participante */}
          {selectedParticipantObj && (
            <div className="bg-[var(--bg-card-subtle)] border border-[var(--border-main)] rounded-xl p-3.5 flex items-center gap-3.5 animate-fadeIn">
              {selectedParticipantObj.imagenMoto && (
                <div className="w-16 h-24 rounded-lg overflow-hidden border border-[var(--border-main)] bg-[var(--bg-input)] p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={selectedParticipantObj.imagenMoto}
                    alt={selectedParticipantObj.modeloMoto}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="space-y-1 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-main)] text-sm">{selectedParticipantObj.modeloMoto}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      selectedParticipantObj.estatusMoto?.toLowerCase().includes('entregada')
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}
                  >
                    {selectedParticipantObj.estatusMoto}
                  </span>
                </div>
                <div className="text-[var(--text-muted)] text-[11px]">
                  Fecha estimada: <strong>{selectedParticipantObj.fechaEntregaCalculada || 'N/A'}</strong>
                </div>
                {selectedParticipantObj.registroEntrega && (
                  <div className="text-emerald-500 font-bold text-[11px]">
                    ✓ Entrega previa registrada: {selectedParticipantObj.registroEntrega}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Selector de Fecha de Entrega */}
          <div className="space-y-2 bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-main)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)]">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Fecha de Entrega: <strong className="text-emerald-500">{finalFecha}</strong></span>
                {!isCustomDate && (
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Hoy
                  </span>
                )}
              </div>

              {!isCustomDate ? (
                <button
                  type="button"
                  onClick={() => setIsCustomDate(true)}
                  className="text-xs text-emerald-500 hover:underline font-bold"
                >
                  Cambiar fecha
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetDateToToday}
                  className="text-xs text-amber-500 hover:underline font-bold"
                >
                  Restablecer a Hoy
                </button>
              )}
            </div>

            {/* Despliegue de Selectores Responsivos (Día / Mes / Año) */}
            {isCustomDate && (
              <div className="grid grid-cols-3 gap-2 pt-2 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Día</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-main)] font-semibold rounded-lg p-2 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500"
                  >
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Mes</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-main)] font-semibold rounded-lg p-2 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500"
                  >
                    {[
                      { num: '01', name: '01 - Ene' },
                      { num: '02', name: '02 - Feb' },
                      { num: '03', name: '03 - Mar' },
                      { num: '04', name: '04 - Abr' },
                      { num: '05', name: '05 - May' },
                      { num: '06', name: '06 - Jun' },
                      { num: '07', name: '07 - Jul' },
                      { num: '08', name: '08 - Ago' },
                      { num: '09', name: '09 - Sep' },
                      { num: '10', name: '10 - Oct' },
                      { num: '11', name: '11 - Nov' },
                      { num: '12', name: '12 - Dic' },
                    ].map((m) => (
                      <option key={m.num} value={m.num}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1">Año</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-main)] font-semibold rounded-lg p-2 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500"
                  >
                    {['2026', '2025'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Botón Principal de Envío */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Continuar para Registrar Entrega de iPhone</span>
          </button>
        </form>
      </div>

      {/* Modal de Confirmación Previa */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl theme-transition">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Confirmar Entrega de iPhone
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[var(--bg-input)] p-3.5 rounded-xl border border-[var(--border-main)] space-y-2">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Participante:</span>
                  <strong className="text-[var(--text-main)] font-bold">
                    {selectedParticipantObj?.id} - {selectedParticipantObj?.nombre}
                  </strong>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Modelo de iPhone:</span>
                  <strong className="text-[var(--text-main)] font-bold">{selectedParticipantObj?.modeloMoto}</strong>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] border-t border-[var(--border-main)] pt-2">
                  <span>Fecha de Entrega:</span>
                  <strong className="text-emerald-500 font-extrabold text-sm">{finalFecha}</strong>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium text-center">
                Esta fecha se guardará en la columna "Registro de Entrega" de Google Sheets y cambiará el estatus a "Entregada".
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-main)] text-[var(--text-muted)] font-semibold text-xs hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Sí, Confirmar Entrega</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
