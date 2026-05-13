import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';
import { Star, Clock, Calendar, ChevronRight, Church, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Volunteer, Assignment, ChurchEvent } from '../types';
import { cn } from '../lib/utils';

import OfficialLogo from './OfficialLogo';

interface HomeProps {
  currentUser: Volunteer;
  assignments: Assignment[];
  events: ChurchEvent[];
  onNavigate: (tab: string) => void;
  onUpdateAssignmentStatus: (id: string, status: 'assigned' | 'confirmed' | 'declined' | 'open') => void;
  onAcceptOpenSlot: (id: string) => void;
}

const VERSES = [
  { text: "O maior entre vocês será aquele que serve.", ref: "Mateus 23:11" },
  { text: "Tudo o que fizerem, façam de todo o coração, como para o Senhor.", ref: "Colossenses 3:23" },
  { text: "Sirvam uns aos outros mediante o amor.", ref: "Gálatas 5:13" }
];

export default function Home({ 
  currentUser, 
  assignments, 
  events, 
  onNavigate, 
  onUpdateAssignmentStatus,
  onAcceptOpenSlot
}: HomeProps) {
  const verse = VERSES[Math.floor(Math.random() * VERSES.length)];

  const nextAssignment = assignments
    .filter(a => a.volunteerId === currentUser.id)
    .map(a => ({
      ...a,
      event: events.find(e => e.id === a.eventId)
    }))
    .filter(a => a.event && parseISO(a.event.date) >= new Date())
    .sort((a, b) => a.event!.date.localeCompare(b.event!.date))[0];

  const openSlots = assignments
    .filter(a => a.status === 'open')
    .map(a => ({
      ...a,
      event: events.find(e => e.id === a.eventId)
    }))
    .filter(a => a.event && parseISO(a.event.date) >= new Date());

  const handleStatusUpdate = (id: string, status: 'confirmed' | 'declined') => {
    onUpdateAssignmentStatus(id, status);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pb-10">
      {/* Open Slots Banner Alert */}
      {openSlots.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-3xl flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Ação Necessária</p>
              <p className="text-xs font-bold text-white">{openSlots.length} {openSlots.length === 1 ? 'vaga disponível' : 'vagas disponíveis'} para servir</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById('open-slots');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[10px] bg-red-500 text-white font-black px-4 py-2 rounded-xl uppercase tracking-widest"
          >
            Ver
          </button>
        </motion.div>
      )}

      {/* Header - CINEMATIC BRANDING */}
      <div className="text-center pt-14 pb-12 space-y-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Official logo component with integrated glow */}
          <div className="w-[180px] h-[180px] relative flex items-center justify-center">
            <OfficialLogo className="w-full h-full" glow={true} />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <h2 className="text-xl sm:text-4xl md:text-6xl text-white font-serif font-light uppercase tracking-[0.4em] sm:tracking-[0.6em] ml-[0.4em] sm:ml-[0.6em] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              SERVINDO AO <span className="text-gold italic font-medium">REINO</span>
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-8 justify-center mt-4 sm:mt-6">
              <div className="hidden sm:block w-16 h-[1px] bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 px-4">
                {['Propósito', 'Excelência', 'Reino'].map((t, i, a) => (
                  <React.Fragment key={t}>
                    <span className="text-[10px] sm:text-[14px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.4em] text-white brightness-110 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{t}</span>
                    {i < a.length - 1 && <span className="text-gold opacity-70 text-[8px] sm:text-[10px]">◆</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="hidden sm:block w-16 h-[1px] bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="pt-6 sm:pt-10 border-t border-white/[0.15] w-full"
          >
            <h3 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">Olá, <span className="text-gold italic font-medium drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">{currentUser.name.split(' ')[0]}</span></h3>
            <p className="text-white/80 text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold mt-2 sm:mt-4 drop-shadow-md">Membro do Ministério de {currentUser.primaryRole}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 2 }}
            className="pt-4 sm:pt-6 max-w-md mx-auto space-y-4 sm:space-y-6"
          >
            <p className="text-lg sm:text-2xl text-white font-serif italic leading-relaxed drop-shadow-md px-4">"{verse.text}"</p>
            <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.3em] sm:tracking-[0.5em] font-black text-gold brightness-125 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{verse.ref}</p>
          </motion.div>
        </div>
      </div>

      {/* Next Scale Card - REORGANIZED FOR USER REQUEST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Sua Próxima Escala</h3>
          <button 
            onClick={() => onNavigate('my-scales')}
            className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1"
          >
            Ver Detalhes <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {nextAssignment ? (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass-card overflow-hidden rounded-[2.5rem] border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-gradient-to-b from-white/[0.05] to-transparent"
          >
            <div className="bg-gold/10 px-8 py-5 flex justify-between items-center border-b border-gold/20">
              <div className="flex items-center gap-2">
                <Church className="w-4 h-4 text-gold" />
                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-gold">{nextAssignment.event?.title}</span>
              </div>
              {nextAssignment.status === 'confirmed' ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Escala Ativa</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/20 rounded-full border border-gold/20">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-gold uppercase tracking-widest">Pendente</span>
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">Ministério</p>
                <p className="text-2xl font-serif text-white flex items-center gap-3">
                  <Star className="w-6 h-6 text-gold" />
                  {nextAssignment.ministry}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Data</p>
                  <p className="text-sm font-bold text-white">{format(parseISO(nextAssignment.event!.date), "dd 'de' MMMM", { locale: ptBR })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Chegada</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gold" />
                    <p className="text-sm font-bold text-white">{nextAssignment.event?.arrivalTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40 uppercase font-black tracking-widest italic">Horário do Culto</span>
                  <span className="text-gold font-black uppercase tracking-widest text-lg">{nextAssignment.event?.time}</span>
                </div>

                {nextAssignment.status !== 'confirmed' && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button 
                      onClick={() => handleStatusUpdate(nextAssignment.id, 'declined')}
                      className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest text-white/40 hover:bg-white/10 transition-all font-sans"
                    >
                      Não poderei
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(nextAssignment.id, 'confirmed')}
                      className="py-4 btn-gold rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all font-sans"
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.4em] font-black italic">
                Obrigado por servir no Reino ✨
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-sm text-white/40 font-medium">Você ainda não tem escalas para os próximos dias.</p>
            <button 
              onClick={() => onNavigate('calendar')}
              className="mt-6 px-8 py-3 bg-gold/10 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest border border-gold/20 hover:bg-gold/20 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Escolher Datas
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('calendar')}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:bg-white/5 transition-all group"
        >
          <div className="w-10 h-10 bg-gold/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5 text-gold" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Calendário</h4>
          <p className="text-[10px] text-white/40 leading-relaxed font-medium">Escolha novos dias para servir no Reino.</p>
        </button>

        <button 
          onClick={() => onNavigate('my-scales')}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:bg-white/5 transition-all group"
        >
          <div className="w-10 h-10 bg-gold/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 text-gold" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Escalas</h4>
          <p className="text-[10px] text-white/40 leading-relaxed font-medium">Veja seus detalhes e responsabilidades.</p>
        </button>
      </div>

      {/* Stats/Badge placeholder */}
      <div className="bg-gold p-[1px] rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
        <div className="bg-black rounded-[23px] p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center relative">
            <Star className="w-6 h-6 text-gold" />
            <div className="absolute -bottom-1 -right-1 bg-gold text-black text-[8px] font-black px-1.5 py-0.5 rounded-full">LVL 4</div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Serviço com Excelência</h4>
            <p className="text-[10px] text-white/40 mt-1 font-medium">Você já serviu em 12 cultos este ano.</p>
          </div>
        </div>
      </div>

      {/* Vagas Disponíveis Section */}
      {openSlots.length > 0 && (
        <div id="open-slots" className="space-y-4 pt-4">
          <div className="flex items-center gap-2 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">🚨 Vagas Disponíveis Urgentemente</h3>
          </div>

          <div className="space-y-4">
            {openSlots.map((slot) => (
              <motion.div 
                key={slot.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-dark border border-gold/20 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(212,175,55,0.05)]"
              >
                <div className="bg-gold/5 px-6 py-3 flex justify-between items-center border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">{slot.event?.title}</span>
                  <span className="text-[8px] font-black uppercase text-white/20">{format(parseISO(slot.event!.date), "dd/MM", { locale: ptBR })}</span>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <Star className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-0.5">Ministério</p>
                      <p className="text-sm font-bold text-white">{slot.ministry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-0.5">Chegada</p>
                    <p className="text-sm font-bold text-white">{slot.event?.arrivalTime}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <button 
                    onClick={() => onAcceptOpenSlot(slot.id)}
                    className="w-full py-4 bg-gold text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    🚀 Assumir Escala
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
