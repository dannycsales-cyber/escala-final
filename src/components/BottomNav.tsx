import React from 'react';
import { Home, Calendar, Star, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'calendar', icon: Calendar, label: 'Calendário' },
    { id: 'my-scales', icon: Star, label: 'Minhas Escalas' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 lg:hidden px-6 pb-6 pt-3 flex justify-between items-center box-content">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center gap-1 group transition-all"
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-gold/20 text-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "text-white/40 hover:text-white"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest transition-all",
              isActive ? "text-gold opacity-100" : "text-white/20 opacity-0 group-hover:opacity-40"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
