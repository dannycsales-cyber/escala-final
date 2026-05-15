import React from 'react';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Clock, Calendar, CheckCircle2, ChevronRight, AlertCircle, Info, Trash2, MessageSquare } from 'lucide-react';
import { Assignment, Volunteer, ChurchEvent, Ministry } from '../types';
import { MINISTRY_GUIDES } from '../constants/ministryGuides';
import { cn } from '../lib/utils';

import OfficialLogo from './OfficialLogo';

interface MyScalesProps {
  currentUser: Volunteer;
  assignments: Assignment[];
  events: ChurchEvent[];
  onCancelAssignment: (id: string) => void;
  onUpdateAssignmentStatus: (id: string, status: 'confirmed' | 'declined' | 'open') => void;
}

export default function MyScales({ 
  currentUser, 
  assignments, 
  events, 
  onCancelAssignment,
  onUpdateAssignmentStatus
}: MyScalesProps) {
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'proximas' | 'confirmadas' | 'finalizadas'>('proximas');

  const myAssignments = assignments
    .filter(a => a.volunteerId === currentUser.id)
    .map(a => ({
      ...a,
      event: events.find(e => e.id === a.eventId)
    }))
    .filter(a => a.event);

  const filteredAssignments = myAssignments.filter(a => {
    const eventDate = parseISO(a.event!.date);
    const now = new Date();
    
    if (filter === 'proximas') return isAfter(eventDate, now) || format(eventDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    if (filter === 'finalizadas') return isBefore(eventDate, now) && format(eventDate, 'yyyy-MM-dd') !== format(now, 'yyyy-MM-dd');
    if (filter === 'confirmadas') return a.status === 'confirmed';
    return true;
  }).sort((a, b) => a.event!.date.localeCompare(b.event!.date));

  const selectedAssignment = myAssignments.find(a => a.id === selectedAssignmentId);
  const selectedGuide = selectedAssignment ? MINISTRY_GUIDES.find(g => g.ministry === selectedAssignment.ministry) : null;
  const [showNotification, setShowNotification] = React.useState<string | null>(null);

  const handleStatusUpdate = (id: string, status: 'confirmed' | 'declined') => {
    onUpdateAssignmentStatus(id, status);
    if (status === 'declined') {
      setSelectedAssignmentId(null);
    } else {
      setShowNotification(id);
      setTimeout(() => setShowNotification(null), 5000);
    }
  };

  const getWhatsAppMessage = (as: any) => {
    return `Olá ${currentUser.name.split(' ')[0]} 🙏\n\nSua escala foi confirmada com sucesso.\n\n📍 ${as.event?.title}\n🎯 Ministério: ${as.ministry}\n🕒 Culto: ${as.event?.time}\n⏰ Chegada: ${as.event?.arrivalTime}\n\nObrigado por servir no Reino ✨`;
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      <header className="flex flex-col items-center gap-4 text-center py-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative group mb-2 scale-110">
          <OfficialLogo className="w-full h-full relative z-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif gold-text tracking-tight uppercase">Minhas Escalas</h2>
        <p className="text-[9px] sm:text-[11px] text-white/70 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold px-4">Servindo com excelência no Reino</p>
        <div className="w-full max-w-xs flex justify-center p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md mt-4">
          {(['proximas', 'confirmadas', 'finalizadas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-3 text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-all rounded-xl",
                filter === f ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" : "text-white/40 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-5 px-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((as) => (
            <div key={as.id} className="relative">
              <motion.div
                layout
                className={cn(
                  "w-full glass-card border rounded-[2rem] p-5 sm:p-6 transition-all relative overflow-hidden",
                  selectedAssignmentId === as.id ? "border-gold ring-1 ring-gold/20" : "border-white/5 hover:border-gold/10"
                )}
              >
                {/* Status Badge */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-[9px] sm:text-[10px] text-gold font-black uppercase tracking-widest leading-none">{as.event?.title}</p>
                    <p className="text-lg sm:text-xl font-serif text-white">{as.event ? format(parseISO(as.event.date), "dd 'de' MMMM", { locale: ptBR }) : ''}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] sm:text-[9px] font-black uppercase tracking-widest",
                    as.status === 'confirmed' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-gold/10 border-gold/20 text-gold"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", as.status === 'confirmed' ? "bg-green-500" : "bg-gold")} />
                    {as.status === 'confirmed' ? 'Escala Confirmada' : 'Aguardando Você'}
                  </div>
                </div>

                {as.status === 'confirmed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-start gap-3"
                  >
                    <div className="p-2 bg-green-500/20 rounded-xl shrink-0">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">WhatsApp Enviado</p>
                      <p className="text-[9px] sm:text-[10px] text-white/40 leading-relaxed italic">"Olá {currentUser.name.split(' ')[0]}, sua escala para {as.event?.title} foi confirmada..."</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="bg-white/10 p-4 sm:p-5 rounded-2xl border-2 border-white/10 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gold shadow-[0_0_8px_#D4AF37]" />
                      <span className="text-[9px] sm:text-[11px] text-white brightness-125 font-black uppercase tracking-widest">Função</span>
                    </div>
                    <p className="text-base sm:text-xl font-bold text-white uppercase tracking-tight drop-shadow-md truncate">{as.ministry}</p>
                  </div>
                  <div className="bg-white/10 p-4 sm:p-5 rounded-2xl border-2 border-white/10 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold shadow-[0_0_8px_#D4AF37]" />
                      <span className="text-[9px] sm:text-[11px] text-white brightness-125 font-black uppercase tracking-widest">Chegada</span>
                    </div>
                    <p className="text-base sm:text-xl font-bold text-white drop-shadow-md">{as.event?.arrivalTime}</p>
                  </div>
                </div>

                {as.status !== 'confirmed' && filter === 'proximas' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => handleStatusUpdate(as.id, 'declined')}
                      className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest text-white/60 hover:bg-white/10 transition-all"
                    >
                      Não poderei ir
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(as.id, 'confirmed')}
                      className="py-4 btn-gold rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Confirmar Presença
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSelectedAssignmentId(selectedAssignmentId === as.id ? null : as.id)}
                  className="w-full py-4 bg-gold/5 border border-gold/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold/10 transition-all"
                >
                  {selectedAssignmentId === as.id ? 'Fechar Detalhes' : 'Ver Responsabilidades'}
                  <ChevronRight className={cn("w-3 h-3 transition-transform", selectedAssignmentId === as.id && "rotate-90")} />
                </button>

                <AnimatePresence>
                  {selectedAssignmentId === as.id && selectedGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-6 pt-6 border-t border-white/5"
                    >
                      <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gold text-black rounded-lg">
                            <Info className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold">Orientações da Liderança</h4>
                            <p className="text-[11px] text-white/60 italic leading-relaxed mt-0.5">{selectedGuide.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {[
                          { label: 'Papel do Voluntário', items: selectedGuide.responsibilities, icon: Star },
                          { label: 'Checklist Antes', items: selectedGuide.checklist.before, icon: CheckCircle2 },
                          { label: 'Checklist Durante', items: selectedGuide.checklist.during, icon: CheckCircle2 },
                          { label: 'Checklist Após', items: selectedGuide.checklist.after, icon: CheckCircle2 }
                        ].map((section, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="flex items-center gap-2">
                              {/* @ts-ignore */}
                              <section.icon className="w-3 h-3 text-gold/40" />
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{section.label}</h5>
                            </div>
                            <div className="space-y-1.5">
                              {section.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group cursor-pointer hover:border-gold/20 transition-all">
                                  <div className="w-5 h-5 rounded-lg border border-gold/30 flex items-center justify-center group-hover:bg-gold/10">
                                    <div className="w-2 h-2 bg-gold rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <span className="text-[11px] font-bold text-white/80">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {filter === 'proximas' && (
                        <div className="pt-4">
                          <button 
                            onClick={() => onCancelAssignment(as.id)}
                            className="w-full py-4 text-[10px] uppercase font-black tracking-[0.3em] text-red-500/40 hover:text-red-500 transition-all"
                          >
                            Cancelar Escala
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white/5" />
            </div>
            <h3 className="text-white/40 font-black uppercase tracking-[0.3em] text-sm">Pronto para servir?</h3>
            <p className="text-white/20 text-xs px-12 leading-relaxed">Você ainda não possui escalas nesta categoria. Acesse o calendário para escolher um dia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
