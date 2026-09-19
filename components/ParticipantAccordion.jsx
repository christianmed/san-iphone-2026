'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Calendar,
  X,
  ZoomIn 
} from 'lucide-react';

export default function ParticipantAccordion({ participants = [], columns = 1 }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedModalImage, setSelectedModalImage] = useState(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedModalImage(null);
    };
    if (selectedModalImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedModalImage]);


  const isMora = (estado) => {
    const est = (estado || '').toLowerCase();
    return est.includes('atraso') || est.includes('mora');
  };

  const isAlDia = (estado) => {
    const est = (estado || '').toLowerCase();
    return est.includes('día') || est.includes('dia');
  };

  const isAdelantado = (estado) => {
    const est = (estado || '').toLowerCase();
    return est.includes('adelantado');
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.modeloMoto.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'MORA') return isMora(p.estado);
    if (filterStatus === 'ADELANTADO') return isAdelantado(p.estado);
    if (filterStatus === 'AL_DIA') return isAlDia(p.estado);

    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (estado) => {
    if (isAdelantado(estado)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Adelantado
        </span>
      );
    }
    if (isAlDia(estado)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <CheckCircle2 className="w-3 h-3" /> Al Día
        </span>
      );
    }
    const label = (estado || '').toLowerCase().includes('mora') ? 'En Mora' : 'Atraso';
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <AlertTriangle className="w-3 h-3" /> {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Buscador e Interfaz de Filtros */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar participante o modelo de iPhone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-input)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] rounded-xl pl-9 pr-4 py-2.5 border border-[var(--border-main)] focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
        </div>

        {/* Chips de filtro */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-all ${
              filterStatus === 'ALL'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                : 'bg-[var(--bg-card)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Todos ({participants.length})
          </button>
          <button
            onClick={() => setFilterStatus('MORA')}
            className={`px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-all ${
              filterStatus === 'MORA'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                : 'bg-[var(--bg-card)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            En Mora ({participants.filter(p => isMora(p.estado)).length})
          </button>
          <button
            onClick={() => setFilterStatus('ADELANTADO')}
            className={`px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-all ${
              filterStatus === 'ADELANTADO'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                : 'bg-[var(--bg-card)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Adelantados ({participants.filter(p => isAdelantado(p.estado)).length})
          </button>
        </div>
      </div>

      {/* Lista Acordeón de Participantes */}
      <div className={columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-start" : "space-y-3"}>
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)]">
            No se encontraron participantes que coincidan con los filtros.
          </div>
        ) : (
          filteredParticipants.map((p, idx) => {
            const isExpanded = expandedId === p.id;
            const uniqueKey = `participant-${p.id || idx}-${p.noAsignado || idx}`;

            return (
              <div
                key={uniqueKey}
                className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden transition-all duration-200 shadow-sm theme-transition"
              >
                {/* Cabecera del Acordeón */}
                <button
                  onClick={() => toggleExpand(p.id)}
                  className="w-full p-4 text-left flex flex-col gap-3 hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 w-full">
                    {/* Izquierda: Número + Foto + (Nombre y Modelo) */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--bg-input)] text-[var(--text-main)] text-xs font-black flex items-center justify-center border border-[var(--border-main)] shrink-0">
                        #{p.noAsignado || p.id}
                      </span>
                      {p.imagenMoto && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModalImage({ src: p.imagenMoto, title: p.modeloMoto, nombre: p.nombre });
                          }}
                          className="w-8 h-12 sm:w-9 sm:h-14 rounded-lg overflow-hidden border border-[var(--border-main)] bg-[var(--bg-input)] p-0.5 flex items-center justify-center shrink-0 cursor-zoom-in group/img relative hover:border-emerald-500 active:scale-95 transition-all shadow-sm"
                          title="Toca para ampliar foto"
                        >
                          <img
                            src={p.imagenMoto}
                            alt={p.modeloMoto}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-[var(--text-main)] text-sm sm:text-base leading-tight">
                          {p.nombre}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5 font-medium">
                          <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                          <span>Pro Max - {p.color || 'Glaciar'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Derecha: Badge de Estado + Chevron */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getStatusBadge(p.estado)}
                      <div className="text-[var(--text-muted)] p-0.5">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso rápida */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">Progreso de Pago</span>
                      <span className="text-emerald-500 font-bold">${p.totalPagado?.toLocaleString('es-MX')} ({p.porcentajeProgreso}%)</span>
                    </div>
                    <div className="w-full bg-[var(--bg-input)] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMora(p.estado) ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${p.porcentajeProgreso}%` }}
                      ></div>
                    </div>
                  </div>
                </button>

                {/* Detalle Desplegable */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[var(--border-main)] bg-[var(--bg-card-subtle)] space-y-4">
                    
                    {/* Imagen de la motocicleta y estado de entrega */}
                    <div className="flex items-center gap-4 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                      {p.imagenMoto && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModalImage({ src: p.imagenMoto, title: p.modeloMoto, nombre: p.nombre });
                          }}
                          className="w-16 h-24 rounded-lg overflow-hidden border border-[var(--border-main)] bg-[var(--bg-input)] p-1.5 flex items-center justify-center shrink-0 cursor-zoom-in group/detail relative hover:border-emerald-500 active:scale-95 transition-all shadow-sm"
                          title="Toca para ver foto en pantalla completa"
                        >
                          <img
                            src={p.imagenMoto}
                            alt={p.modeloMoto}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span className="absolute inset-0 bg-black/45 opacity-0 group-hover/detail:opacity-100 flex items-center justify-center transition-opacity rounded-md text-white text-[10px] font-bold gap-1">
                            <ZoomIn className="w-4 h-4 text-emerald-400" /> Ver
                          </span>
                        </div>
                      )}
                      <div className="space-y-1 text-xs">
                        <div className="text-[var(--text-muted)] font-medium">
                          Estatus Entrega: <span className="text-[var(--text-main)] font-bold">{p.estatusMoto}</span>
                        </div>
                        <div className="text-[var(--text-muted)] flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Entrega calculada:{' '}
                          <span className="text-[var(--text-main)] font-semibold">
                            {p.fechaEntregaCalculada || 'N/A'}
                          </span>
                        </div>
                        {p.registroEntrega && (
                          <div className="text-emerald-500 font-bold text-[11px]">
                            ✓ Entregado el: {p.registroEntrega}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grilla de Métricas Financieras del Usuario */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                      
                      <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[var(--text-muted)] text-[11px] font-semibold">Target al Día</div>
                        <div className="text-sm font-bold text-[var(--text-main)]">${p.targetAlDia?.toLocaleString('es-MX')}</div>
                      </div>

                      <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[var(--text-muted)] text-[11px] font-semibold">Deuda Total</div>
                        <div className={`text-sm font-bold ${p.deudaTotal > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          ${p.deudaTotal?.toLocaleString('es-MX')}
                        </div>
                      </div>

                      <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[var(--text-muted)] text-[11px] font-semibold">Saldo / Diferencia</div>
                        <div className={`text-sm font-bold ${p.saldo < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          ${p.saldo?.toLocaleString('es-MX')}
                        </div>
                      </div>

                      <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[var(--text-muted)] text-[11px] font-semibold">Cuota Semanal</div>
                        <div className="text-sm font-bold text-[var(--text-main)]">${p.cuotaSemanal?.toLocaleString('es-MX')}/sem</div>
                      </div>

                    </div>

                    {/* Cuotas Completadas vs Vencidas */}
                    <div className="flex items-center justify-between text-xs bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Cuotas completadas: <span className="font-bold text-[var(--text-main)]">{p.cuotasCompletadas}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                        <Clock className="w-4 h-4" /> Vencidas: <span className="font-bold text-[var(--text-main)]">{p.cuotasVencidas}</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Imagen Ampliada */}
      {selectedModalImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedModalImage(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedModalImage(null);
            }}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center transition-all border border-white/20 shadow-xl cursor-pointer"
            aria-label="Cerrar imagen"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative flex flex-col items-center max-w-sm sm:max-w-md w-full max-h-[92vh] bg-[var(--bg-card)]/95 border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center overflow-hidden py-1">
              <img
                src={selectedModalImage.src}
                alt={selectedModalImage.title}
                className="max-h-[64vh] sm:max-h-[68vh] w-auto max-w-full object-contain filter drop-shadow-2xl"
              />
            </div>

            <div className="mt-3 px-4 py-2 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-main)] text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm text-center">
              <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{selectedModalImage.title}</span>
            </div>
            
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-medium">
              Toca la <span className="font-bold">X</span> o cualquier lugar fuera para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}