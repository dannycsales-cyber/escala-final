import React from 'react';
import { Lock, Mail, Eye, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import OfficialLogo from '../OfficialLogo';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => void;
  error?: string;
}

export default function AdminLogin({ onLogin, error }: AdminLoginProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-40">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-0 right-0 w-[80%] h-[80%] bg-gold/10 rounded-full blur-[120px]"
         />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12 relative z-10"
      >
        <div className="text-center space-y-6 px-4">
          <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto">
            <OfficialLogo />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif gold-text tracking-tight">Painel Administrativo</h2>
            <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-black leading-relaxed">Acesso Restrito • Gestão Ministerial</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-premium p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-shake">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative group/input border-b-2 border-white/20 focus-within:border-gold transition-all pb-4">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gold group-focus-within/input:brightness-125 transition-all" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-MAIL ADMINISTRATIVO"
                required
                className="w-full bg-transparent py-4 pl-12 pr-6 outline-none transition-all text-base text-white placeholder:text-white/20 font-bold tracking-widest uppercase"
              />
            </div>

            <div className="relative group/input border-b-2 border-white/20 focus-within:border-gold transition-all pb-4">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gold group-focus-within/input:brightness-125 transition-all" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SENHA DE ACESSO"
                required
                className="w-full bg-transparent py-4 pl-12 pr-12 outline-none transition-all text-base text-white placeholder:text-white/20 font-bold tracking-widest uppercase"
              />
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/5 hover:text-white/20 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 btn-premium-gold rounded-full text-[11px] font-black uppercase tracking-[0.6em] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            AUTENTICAR
          </button>
        </form>

        <p className="text-center text-[9px] text-white/10 uppercase tracking-widest">
           CJPP v3.0 • Sistema de Gestão Ministerial
        </p>
      </motion.div>
    </div>
  );
}
