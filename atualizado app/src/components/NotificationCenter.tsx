import React from 'react';
import { Bell, X, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import OfficialLogo from './OfficialLogo';

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onAcceptSlot: (assignmentId: string) => void;
}

export default function NotificationCenter({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onDelete, 
  onClearAll,
  onAcceptSlot
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-black border-l border-white/5 z-[101] shadow-2xl flex flex-col"
          >
          <header className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative group">
                <OfficialLogo className="w-full h-full relative z-10" glow={false} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white leading-none">Avisos</h2>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold font-black mt-1">CJPP Ministerial</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <X className="w-5 h-5 text-white/40" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all relative group",
                    notification.read ? "bg-white/[0.02] border-white/5" : "bg-gold/5 border-gold/20",
                    notification.type === 'open-slot' && "bg-gold/10 border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                  )}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0",
                      notification.type === 'reminder' ? "bg-gold/10 text-gold" :
                      notification.type === 'alert' || notification.type === 'open-slot' ? "bg-red-500/10 text-red-500" :
                      "bg-green-500/10 text-green-500"
                    )}>
                      {notification.type === 'reminder' ? <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> :
                       notification.type === 'alert' || notification.type === 'open-slot' ? <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" /> :
                       <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div className="space-y-1.5 sm:space-y-2 pr-4 sm:pr-6 text-left w-full">
                      <p className="text-[11px] sm:text-sm font-black uppercase tracking-widest text-white drop-shadow-md">
                        {notification.title}
                      </p>
                      <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.type === 'open-slot' && notification.assignmentId && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptSlot(notification.assignmentId!);
                          }}
                          className="w-full mt-3 sm:mt-4 py-3 sm:py-4 bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          ✅ Assumir Escala
                        </button>
                      )}
                      <p className="text-[10px] sm:text-[12px] text-gold font-black uppercase tracking-[0.2em] pt-2 sm:pt-3 drop-shadow-sm">
                        {format(parseISO(notification.date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500/40 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <Bell className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Nenhum aviso</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <footer className="p-6 border-t border-white/5">
                <button 
                  onClick={onClearAll}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all border border-dashed border-white/10 rounded-2xl"
                >
                  Limpar tudo
                </button>
              </footer>
            )}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
