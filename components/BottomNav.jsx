'use client';

import React from 'react';
import { LayoutDashboard, Users, History, CreditCard, PackageCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'participants', label: 'Participantes', icon: Users },
    { id: 'payments', label: 'Pagos', icon: History },
    { id: 'register', label: 'Abonar', icon: CreditCard },
    { id: 'deliveries', label: 'Entregas', icon: PackageCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-header)] backdrop-blur-lg border-t border-[var(--border-main)] px-2 py-2 pb-safe md:hidden theme-transition shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-500 bg-emerald-500/10 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
