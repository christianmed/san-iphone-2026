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
    <nav className="fixed bottom-3.5 left-3 right-3 sm:left-6 sm:right-6 z-50 max-w-md mx-auto bg-[var(--bg-header)]/90 backdrop-blur-xl border border-[var(--border-main)] shadow-2xl shadow-black/20 rounded-full p-1.5 md:hidden theme-transition">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]/70 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
