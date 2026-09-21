'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Sun, Moon, Delete, Lock, RefreshCw, AlertCircle } from 'lucide-react';

export default function NumericKeypadLogin({ onLoginSuccess, theme, toggleTheme }) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Escuchar teclas del teclado físico (0-9, Backspace, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) return;

      if (e.key >= '0' && e.key <= '9') {
        handleAddDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Escape') {
        handleClearPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isLoading]);

  const handleAddDigit = (digit) => {
    if (pin.length >= 8) return;
    setErrorMessage('');
    const newPin = pin + digit;
    setPin(newPin);

    // Auto-envío al completar los 8 dígitos
    if (newPin.length === 8) {
      submitPin(newPin);
    }
  };

  const handleDeleteDigit = () => {
    if (pin.length === 0) return;
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMessage('');
  };

  const submitPin = async (pinToSubmit) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToSubmit }),
      });

      const data = await res.json();

      if (data.success) {
        if (onLoginSuccess) {
          onLoginSuccess({
            role: data.role,
            user: data.user,
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between items-center p-4 relative theme-transition select-none">
      {/* Botón Flotante Superior de Tema (Claro / Oscuro) */}
      <header className="w-full max-w-md flex justify-end pt-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] text-[var(--text-main)] active:scale-95 transition-all shadow-sm"
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
          className={`bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 sm:p-8 shadow-2xl theme-transition transition-transform ${
            isShaking ? 'animate-shake border-rose-500/50' : ''
          }`}
        >
          {/* Ícono de Cabecera */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-sm">
              <Smartphone className="w-7 h-7" />
            </div>
          </div>

          {/* Título y Subtítulo */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black tracking-tight text-[var(--text-main)]">
              Dashboard
            </h1>
            <div className="text-center text-xs font-semibold leading-relaxed">
              <p className="text-emerald-500 tracking-wider font-bold">
                • Gestión y Consulta •
              </p>
              <p className="text-[var(--text-muted)] font-medium">
                San de iPhone 18 Pro Max
              </p>
            </div>
          </div>

          {/* Indicadores Circulares de los 8 Dígitos */}
          <div className="flex items-center justify-center gap-2.5 my-6 py-1">
            {Array.from({ length: 8 }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                    isFilled
                      ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm shadow-emerald-500/50'
                      : 'bg-[var(--bg-input)] border-[var(--border-main)]'
                  }`}
                />
              );
            })}
          </div>

          {/* Mensaje de Instrucción o Error */}
          <div className="text-center min-h-[24px] mb-5">
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

          {/* Teclado Numérico (Grid 3x4) */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleAddDigit(String(num))}
                disabled={isLoading}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-dial)] text-[var(--text-dial)] font-normal text-2xl sm:text-3xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-40 flex items-center justify-center cursor-pointer select-none"
              >
                {num}
              </button>
            ))}

            {/* Tecla C: Limpiar Todo */}
            <button
              type="button"
              onClick={handleClearPin}
              disabled={isLoading || pin.length === 0}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] hover:text-rose-500 active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-dial)] text-[var(--text-muted)] font-semibold text-lg sm:text-xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-30 flex items-center justify-center cursor-pointer select-none"
              title="Limpiar PIN"
            >
              C
            </button>

            {/* Tecla 0 */}
            <button
              type="button"
              onClick={() => handleAddDigit('0')}
              disabled={isLoading}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-dial)] text-[var(--text-dial)] font-normal text-2xl sm:text-3xl shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-40 flex items-center justify-center cursor-pointer select-none"
            >
              0
            </button>

            {/* Tecla ⌫: Borrar un Dígito */}
            <button
              type="button"
              onClick={handleDeleteDigit}
              disabled={isLoading || pin.length === 0}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto bg-[var(--bg-dial-btn)] hover:bg-[var(--bg-dial-btn-hover)] hover:text-[var(--text-main)] active:bg-[var(--bg-dial-btn-active)] border border-[var(--border-dial)] text-[var(--text-muted)] shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-30 flex items-center justify-center cursor-pointer select-none"
              title="Borrar último"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </main>

      {/* Pie de Página Sutil */}
      <footer className="w-full text-center pb-2 text-[11px] text-[var(--text-muted)]">
        <span>Sistema de Gestión de Tandas • Acceso Seguro</span>
      </footer>
    </div>
  );
}
