import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  Menu, 
  X,
  PlusCircle,
  Bell,
  FileText,
  Church,
  Star,
  Home as HomeIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import OfficialLogo from './OfficialLogo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  unreadNotificationsCount,
  onOpenNotifications 
}: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: HomeIcon },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: CalendarIcon },
    { id: 'my-scales', label: 'Minhas Escalas', icon: Star },
    { id: 'volunteers', label: 'Voluntários', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'profile', label: 'Perfil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4 glass sticky top-0 z-50 rounded-b-[2rem] border-b border-white/5 mx-2 mt-2 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full relative group">
            <OfficialLogo className="w-full h-full relative z-10" glow={false} />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gold/80 font-black">Escala Ministerial</p>
            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/30 mt-0.5 font-bold">Servindo com Excelência</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenNotifications}
            className="p-2 sm:p-2.5 bg-white/5 rounded-xl border border-white/5 relative group active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-gold transition-colors" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white ring-2 ring-black">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 sm:p-2.5 bg-white/5 rounded-xl border border-white/5 active:scale-95 transition-all lg:hidden">
            {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-[220px] bg-gray-dark border-r border-gray-med transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="pt-8 h-full flex flex-col">
            <div className="px-8 mb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 group relative scale-110">
                <OfficialLogo className="w-full h-full relative z-10" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">COMUNIDADE JESUS</p>
              <p className="text-[9px] uppercase tracking-[0.4em] opacity-30 font-black mt-2">PLANO PERFEITO</p>
            </div>

            <nav className="flex-1 space-y-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-8 py-3 transition-all duration-200 group relative text-sm",
                      isActive 
                        ? "bg-gold-dim text-gold border-r-2 border-gold" 
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-gold" : "opacity-50")} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6">
              <div className="glass p-4 rounded-xl text-center">
                <p className="text-[11px] mb-2 opacity-70">Status de Automação</p>
                <div className="h-1.5 w-full bg-gray-med rounded-full mb-2">
                  <div className="h-full bg-gold w-[92%] rounded-full shadow-[0_0_8px_#D4AF37]"></div>
                </div>
                <p className="text-[10px] gold-text font-bold">92% Preenchido</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-x-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
