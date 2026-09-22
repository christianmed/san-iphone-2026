'use client';

import { useState } from 'react';
import { Smartphone, Delete, Moon, Sun, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { isValidPinFormat, authenticatePin } from '../lib/authHelper';

export default function NumericKeypadLogin({ onLoginSuccess, theme, toggleTheme }) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleAddDigit = (digit) => {
    if (pin.length < 8 && !isLoading) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === 8) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDeleteDigit = () => {
    if (pin.length > 0 && !isLoading) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClearPin = () => {
    if (!isLoading) {
      setPin('');
      setErrorMessage('');
    }
  };

  const verifyPin = async (completedPin) => {
    if (!isValidPinFormat(completedPin)) {
      triggerShakeError('El PIN debe tener exactamente 8 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: completedPin })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onLoginSuccess) {
          onLoginSuccess({
            role: data.role,
            participant: data.participant || null,
            pin: completedPin
          });
        }
      } else {
        triggerShakeError(data.error || 'PIN incorrecto.');
      }
    } catch (err) {
      triggerShakeError('Error de red al verificar el PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShakeError = (msg) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setPin('');
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
  };

  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between items-center px-4 py-3 sm:py-6 relative theme-transition select-none">
      {/* Botón Flotante Superior de Tema (Claro / Oscuro) - Alineado a la tarjeta */}
      <header className="w-full max-w-sm flex justify-end">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] text-[var(--text-main)] active:scale-95 transition-all shadow-sm cursor-pointer"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </header>

      {/* Tarjeta Central del Teclado Numérico */}
      <main className="my-auto w-full max-w-sm">
        <div
          className={`bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-5 sm:p-7 shadow-2xl theme-transition transition-transform ${
            isShaking ? 'animate-shake border-rose-500/50' : ''
          }`}
        >
          {/* Ícono de Cabecera */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>

          {/* Título y Subtítulo */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black tracking-tight text-[var(--text-main)]">
              Dashboard
            </h1>
            <div className="text-center text-xs font-semibold leading-normal">
              <p className="text-emerald-500 tracking-wider font-bold">
                • Gestión y Consulta •
              </p>
              <p className="text-[var(--text-muted)] font-medium">
                San de iPhone 18 Pro Max
              </p>
            </div>
          </div>

          {/* Indicadores Circulares de los 8 Dígitos con Contraste Mejorado */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-3.5 sm:my-4 py-0.5">
            {Array.from({ length: 8 }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                    isFilled
                      ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm shadow-emerald-500/50'
                      : 'bg-slate-200/90 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  }`}
                />
              );
            })}
          </div>

          {/* Mensaje de Instrucción o Error */}
          <div className="text-center min-h-[22px] mb-3.5 sm:mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-500 font-semibold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verificando PIN...</span>
              </div>
            ) : errorMessage ? (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-bold animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Ingresa tu PIN de acceso (8 números)</span>
              </div>
            )}
          </div>

          {/* Teclado Numérico (Grid 3x4 Armonizado) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[240px] sm:max-w-[260px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleAddDigit(String(num))}
                disabled={isLoading}
                className="w-[4.15rem] h-[4.15rem] sm:w-[4.5rem] sm:h-[4.5rem] rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-main)] text-[var(--text-main)] font-bold text-2xl sm:text-3xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-40 flex items-center justify-center cursor-pointer select-none"
              >
                {num}
              </button>
            ))}

            {/* Tecla C: Limpiar Todo con Contraste Nítido */}
            <button
              type="button"
              onClick={handleClearPin}
              disabled={isLoading || pin.length === 0}
              className="w-[4.15rem] h-[4.15rem] sm:w-[4.5rem] sm:h-[4.5rem] rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] hover:text-rose-500 hover:border-rose-500/40 active:bg-rose-500/10 border border-[var(--border-main)] text-[var(--text-main)] font-semibold text-lg sm:text-xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-30 flex items-center justify-center cursor-pointer select-none"
              title="Limpiar PIN"
            >
              C
            </button>

            {/* Tecla 0 */}
            <button
              type="button"
              onClick={() => handleAddDigit('0')}
              disabled={isLoading}
              className="w-[4.15rem] h-[4.15rem] sm:w-[4.5rem] sm:h-[4.5rem] rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-main)] text-[var(--text-main)] font-bold text-2xl sm:text-3xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-40 flex items-center justify-center cursor-pointer select-none"
            >
              0
            </button>

            {/* Tecla ⌫: Borrar un Dígito con Contraste Nítido */}
            <button
              type="button"
              onClick={handleDeleteDigit}
              disabled={isLoading || pin.length === 0}
              className="w-[4.15rem] h-[4.15rem] sm:w-[4.5rem] sm:h-[4.5rem] rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] hover:text-[var(--text-main)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-main)] text-[var(--text-main)] shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-30 flex items-center justify-center cursor-pointer select-none"
              title="Borrar último"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </button>
          </div>
        </div>
      </main>

      {/* Pie de Página Nítido y Proporcional */}
      <footer className="w-full text-center py-2 text-xs text-[var(--text-muted)] font-medium">
        <span>Sistema de Gestión de Tandas • Acceso Seguro</span>
      </footer>
    </div>
  );
}
