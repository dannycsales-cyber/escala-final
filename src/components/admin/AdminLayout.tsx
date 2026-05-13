import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  BarChart3,
  Search,
  ShieldCheck,
  Building2,
  Menu,
  X
} from 'lucide-react';
import OfficialLogo from '../OfficialLogo';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  adminName: string;
}

export default function AdminLayout({ children, activeView, onViewChange, onLogout, adminName }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scales', label: 'Escalas', icon: Calendar },
    { id: 'ministries', label: 'Ministérios', icon: Building2 },
    { id: 'volunteers', label: 'Voluntários', icon: Users },
    { id: 'notifications', label: 'Comunicados', icon: Bell },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-80 flex-col bg-gray-dark border-r border-white/5 p-8 relative z-50">
        <div className="space-y-10">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12">
              <OfficialLogo />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black gold-text leading-none">ADMIN</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mt-1">Gestão de Reino</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  activeView === item.id 
                    ? 'btn-premium-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-10 space-y-6">
          <div className="glass-premium p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gold/10 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate">{adminName}</p>
                <p className="text-xs font-bold text-white leading-none">Super Administrador</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-4 flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair do Painel
            </button>
          </div>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-gray-dark sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10">
            <OfficialLogo />
          </div>
          <h1 className="text-lg font-serif font-black gold-text">ADMIN</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white/5 rounded-xl text-gold"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-black z-[90] p-6 flex flex-col items-center justify-center gap-8 md:hidden"
          >
             {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-4 px-6 py-5 rounded-3xl transition-all duration-300 ${
                  activeView === item.id 
                    ? 'btn-premium-gold' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xl font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
            <button 
              onClick={onLogout}
              className="mt-10 px-10 py-5 bg-red-500/20 border border-red-500/40 rounded-full text-red-500 font-black uppercase tracking-widest"
            >
              LOGOUT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {/* Cinematic ambient lights */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/3 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
          <div className="flex items-center justify-between mb-12 hidden md:flex">
             <div className="relative group w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
               <input 
                 type="text" 
                 placeholder="BUSCAR VOLUNTÁRIO, ESCALA OU MINISTÉRIO..."
                 className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest placeholder:text-white/10 focus:border-gold/30 outline-none transition-all"
               />
             </div>
             <div className="flex items-center gap-6">
                <button className="relative p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-gold">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-dark shadow-[0_0_10px_#ef4444]" />
                </button>
                <div className="h-10 w-[1px] bg-white/5" />
                <div className="flex items-center gap-4">
                   <div className="text-right">
                     <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">{adminName}</p>
                     <p className="text-[8px] font-bold text-gold/40 uppercase tracking-widest mt-1">Master Admin</p>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center font-black shadow-lg">AD</div>
                </div>
             </div>
          </div>

          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
