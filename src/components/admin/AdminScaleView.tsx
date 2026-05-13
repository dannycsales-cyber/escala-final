import React from 'react';
import { 
  Calendar, 
  Plus, 
  Copy, 
  Globe, 
  Eye, 
  Edit3, 
  X, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { ChurchEvent, Assignment, Volunteer, Ministry, MINISTRY_REQUIREMENTS } from '../../types';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminScaleViewProps {
  events: ChurchEvent[];
  assignments: Assignment[];
  volunteers: Volunteer[];
  onAddEvent: (event: ChurchEvent) => void;
  onUpdateEvent: (event: ChurchEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAutoSchedule: (eventId: string) => void;
}

export default function AdminScaleView({ 
  events, 
  assignments, 
  volunteers, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  onAutoSchedule 
}: AdminScaleViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedEvent, setSelectedEvent] = React.useState<ChurchEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = React.useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = React.useState('');
  const [newDate, setNewDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTime, setNewTime] = React.useState('19:00');
  const [newArrivalTime, setNewArrivalTime] = React.useState('18:00');
  const [newType, setNewType] = React.useState<ChurchEvent['type']>('recurrent');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsInMonth = events.filter(e => isSameMonth(parseISO(e.date), currentMonth));

  const handleCreateEvent = () => {
    if (!newTitle) return;
    const event: ChurchEvent = {
        id: `e-${Date.now()}`,
        title: newTitle,
        date: newDate,
        time: newTime,
        arrivalTime: newArrivalTime,
        type: newType,
        status: 'draft',
        teamsNeeded: Object.keys(MINISTRY_REQUIREMENTS) as Ministry[]
    };
    onAddEvent(event);
    setIsAddingEvent(false);
    // Reset form
    setNewTitle('');
  };

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-0">
        <div className="space-y-4">
           <h2 className="text-2xl sm:text-4xl font-serif font-black gold-text tracking-tight italic uppercase">Gestão de Escalas</h2>
           <div className="flex items-center gap-4 mt-2">
             <Calendar className="w-4 h-4 text-white/40" />
             <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-[0.2em]">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
           <button className="w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
             <Copy className="w-4 h-4" />
             Duplicar Mês Anterior
           </button>
           <button 
             onClick={() => setIsAddingEvent(true)}
             className="w-full sm:w-auto px-8 py-4 btn-premium-gold rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
           >
             <Plus className="w-4 h-4" />
             Criar Novo Evento
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* CALENDAR COLUMN */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-premium p-8 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                   <ChevronRight className="w-5 h-5 rotate-180 text-white/40 hover:text-gold" />
                </button>
                <p className="text-sm font-serif font-black text-white uppercase tracking-widest">{format(currentMonth, 'MMMM', { locale: ptBR })}</p>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                   <ChevronRight className="w-5 h-5 text-white/40 hover:text-gold" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-white/10 py-2">{d}</div>
                ))}
                {days.map((day, i) => {
                  const hasEvent = eventsInMonth.some(e => isSameDay(parseISO(e.date), day));
                  const isCurrentDay = isSameDay(day, new Date());
                  
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const evt = eventsInMonth.find(e => isSameDay(parseISO(e.date), day));
                        if(evt) setSelectedEvent(evt);
                      }}
                      className={cn(
                        "aspect-square rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative border",
                        hasEvent 
                          ? "bg-gold/10 border-gold/30 text-white hover:bg-gold/20" 
                          : "bg-transparent border-transparent text-white/20 hover:border-white/5"
                      )}
                    >
                      <span>{format(day, 'd')}</span>
                      {hasEvent && (
                        <div className="w-1 h-1 bg-gold rounded-full mt-1 shadow-[0_0_5px_#D4AF37]" />
                      )}
                      {isCurrentDay && !hasEvent && (
                        <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
           </div>

           <div className="space-y-4">
             <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2">Legenda</h4>
             <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-3 h-3 bg-gold rounded-full shadow-[0_0_8px_#D4AF37]" />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Evento Criado</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-3 h-3 bg-red-500/40 rounded-full" />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Escala Pendente</span>
                </div>
             </div>
           </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-8 space-y-8">
           <AnimatePresence mode="wait">
             {selectedEvent ? (
               <motion.div
                 key={selectedEvent.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="glass-premium p-10 rounded-[3rem] border border-white/10 relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-10 flex gap-4">
                    <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-gold">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDeleteEvent(selectedEvent.id)}
                      className="p-3 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-all text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="space-y-12">
                   {/* Event Header */}
                   <div className="space-y-4">
                      <span className="px-5 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black text-gold uppercase tracking-widest">
                        {selectedEvent.type}
                      </span>
                      <h3 className="text-5xl font-serif font-black text-white italic tracking-tight">{selectedEvent.title}</h3>
                      <div className="flex flex-wrap items-center gap-8 text-white/40">
                         <div className="flex items-center gap-3">
                           <Calendar className="w-5 h-5 text-gold" />
                           <span className="text-sm font-bold uppercase tracking-widest">{format(parseISO(selectedEvent.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <Clock className="w-5 h-5 text-gold" />
                           <span className="text-sm font-bold uppercase tracking-widest">{selectedEvent.time} (Chegada: {selectedEvent.arrivalTime})</span>
                         </div>
                      </div>
                   </div>

                   {/* Scale Status */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Status da Escala</h4>
                           <Globe className="w-4 h-4 text-white/10" />
                        </div>
                        <div className="flex items-end justify-between mb-4">
                           <p className="text-4xl font-serif font-black text-white">
                              {assignments.filter(a => a.eventId === selectedEvent.id).length} / 12
                           </p>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">Vagas Preenchidas</p>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(assignments.filter(a => a.eventId === selectedEvent.id).length / 12) * 100}%` }}
                             className="h-full bg-gold shadow-[0_0_15px_#D4AF37]"
                           />
                        </div>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => onAutoSchedule(selectedEvent.id)}
                             className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                             Agendamento Automático
                           </button>
                           <button className="flex-1 py-4 btn-premium-gold rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                             Publicar Escala
                           </button>
                        </div>
                      </div>

                      <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 space-y-6">
                         <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Resumo por Ministério</h4>
                         <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                            {selectedEvent.teamsNeeded.map(min => (
                              <div key={min} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gold/40" />
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{min}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3 text-white/20" />
                                    <span className="text-xs font-black text-white">{assignments.filter(a => a.eventId === selectedEvent.id && a.ministry === min).length} / {MINISTRY_REQUIREMENTS[min]}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Assigned Volunteers Table View */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Corpo de Serviço Escalado</h4>
                        <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Ver Detalhado</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {assignments.filter(a => a.eventId === selectedEvent.id).map(as => {
                           const v = volunteers.find(vol => vol.id === as.volunteerId);
                           if (!v) return null;
                           return (
                             <div key={as.id} className="p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-gold text-black flex items-center justify-center font-black text-xs shadow-lg">
                                      {v.name.slice(0, 1)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white group-hover:gold-text transition-all leading-none">{v.name}</p>
                                      <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1 font-black">{as.ministry}</p>
                                   </div>
                                </div>
                                <div className={cn(
                                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                  as.status === 'confirmed' ? "bg-green-500/10 text-green-500" : "bg-gold/10 text-gold"
                                )}>
                                  {as.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                </div>
                             </div>
                           )
                         })}
                         {assignments.filter(a => a.eventId === selectedEvent.id && a.status === 'open').map(as => (
                            <div key={as.id} className="p-5 bg-red-500/5 border border-red-500/20 border-dashed rounded-3xl flex items-center justify-between group hover:bg-red-500/10 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-black text-xs">
                                     ?
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-red-500 leading-none italic animate-pulse">Vaga em Aberto</p>
                                     <p className="text-[9px] text-red-500/40 uppercase tracking-widest mt-1 font-black">{as.ministry}</p>
                                  </div>
                               </div>
                               <button className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-[8px] font-black uppercase tracking-wider">Substituir</button>
                            </div>
                         ))}
                      </div>
                   </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-white/5 rounded-[3rem] text-white/10 italic font-serif text-2xl"
               >
                 <div className="p-8 bg-white/5 rounded-full mb-6">
                    <Calendar className="w-12 h-12" />
                 </div>
                 Selecione um evento para gerenciar a escala
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {isAddingEvent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-2xl glass-premium p-12 rounded-[3.5rem] border border-white/10 overflow-hidden relative"
             >
                <button 
                  onClick={() => setIsAddingEvent(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/20 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-12">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-serif font-black gold-text italic tracking-tight">Novo Culto/Evento</h3>
                      <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black">Adicionar ao Calendário Ministerial</p>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-10">
                        {/* Title Input */}
                        <div className="relative group/input border-b-2 border-white/20 focus-within:border-gold transition-all pb-4">
                          <input 
                            type="text" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="NOME DO EVENTO (EX: CULTO DE CELEBRAÇÃO)"
                            className="w-full bg-transparent py-2 px-1 outline-none transition-all text-2xl text-white placeholder:text-white/10 font-serif italic"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Data e Horários</h4>
                              <div className="space-y-4">
                                 <div className="relative group/input border-b border-white/10 focus-within:border-gold transition-all pb-2">
                                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold" />
                                    <input 
                                      type="date" 
                                      value={newDate}
                                      onChange={(e) => setNewDate(e.target.value)}
                                      className="w-full bg-transparent py-2 pl-8 outline-none text-sm text-white/60 font-bold tracking-widest"
                                    />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group/input border-b border-white/10 focus-within:border-gold transition-all pb-2">
                                       <Clock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold" />
                                       <input 
                                         type="time" 
                                         value={newTime}
                                         onChange={(e) => setNewTime(e.target.value)}
                                         className="w-full bg-transparent py-2 pl-8 outline-none text-sm text-white/60 font-bold tracking-widest"
                                       />
                                    </div>
                                    <div className="relative group/input border-b border-white/10 focus-within:border-gold transition-all pb-2">
                                       <Clock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold" />
                                       <input 
                                         type="time" 
                                         value={newArrivalTime}
                                         onChange={(e) => setNewArrivalTime(e.target.value)}
                                         className="w-full bg-transparent py-2 pl-8 outline-none text-sm text-white/60 font-bold tracking-widest"
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Tipo de Evento</h4>
                              <div className="grid grid-cols-1 gap-2">
                                 {(['recurrent', 'special', 'conference', 'vigil'] as const).map(type => (
                                   <button
                                     key={type}
                                     onClick={() => setNewType(type)}
                                     className={cn(
                                       "px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between",
                                       newType === type ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                     )}
                                   >
                                     {type}
                                     {newType === type && <CheckCircle2 className="w-4 h-4" />}
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="pt-10 flex gap-6">
                         <button 
                           onClick={() => setIsAddingEvent(false)}
                           className="flex-1 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                         >
                           CANCELAR
                         </button>
                         <button 
                           onClick={handleCreateEvent}
                           className="flex-[2] py-5 btn-premium-gold rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl"
                         >
                           CRIAR EVENTO
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
