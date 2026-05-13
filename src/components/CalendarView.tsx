import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check,
  AlertCircle,
  Clock,
  Users,
  Trash2,
  Sparkles,
  Star,
  Calendar as CalendarIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO,
  isAfter
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ChurchEvent, Assignment, Volunteer, MINISTRY_REQUIREMENTS, Ministry } from '../types';
import AddEventModal from './AddEventModal';

interface CalendarViewProps {
  events: ChurchEvent[];
  assignments: Assignment[];
  volunteers: Volunteer[];
  onAutoSchedule: () => void;
  onJoinEvent: (eventId: string, ministry: Ministry) => void;
  onCancelAssignment: (assignmentId: string) => void;
  currentUser: Volunteer;
  onAddEvent?: (event: ChurchEvent) => void;
}

const VERSES = [
  { text: "Quem quiser tornar-se importante entre vocês deverá ser servo.", ref: "Mateus 20:26" },
  { text: "Sirvam uns aos outros mediante o amor.", ref: "Gálatas 5:13" },
  { text: "Tudo o que fizerem, façam de todo o coração, como para o Senhor.", ref: "Colossenses 3:23" },
  { text: "Servi ao Senhor com alegria.", ref: "Salmos 100:2" },
  { text: "Aquele que serve a Cristo é agradável a Deus.", ref: "Romanos 14:18" }
];

export default function CalendarView({ 
  events, 
  assignments, 
  volunteers, 
  onAutoSchedule, 
  onJoinEvent, 
  onCancelAssignment,
  currentUser,
  onAddEvent
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [joiningMinistry, setJoiningMinistry] = React.useState<{ eventId: string, ministry: Ministry } | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [currentVerse, setCurrentVerse] = React.useState(VERSES[0]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (showSuccess) {
      setCurrentVerse(VERSES[Math.floor(Math.random() * VERSES.length)]);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventForDay = (day: Date) => events.find(e => isSameDay(parseISO(e.date), day));
  const getAssignmentsForDay = (day: Date) => {
    const event = getEventForDay(day);
    if (!event) return [];
    return assignments.filter(a => a.eventId === event.id);
  };

  const getOccupancyInfo = (event: ChurchEvent) => {
    const eventAssignments = assignments.filter(a => a.eventId === event.id);
    const totalRequired = event.teamsNeeded.length; // Simplified for now, showing ministries needed
    const totalAssigned = eventAssignments.length;
    const percentage = totalRequired > 0 ? (totalAssigned / totalRequired) * 100 : 0;
    
    let statusColor = "bg-red-500";
    let statusText = "Escala Incompleta";
    let statusIcon = AlertCircle;

    if (totalAssigned >= totalRequired) {
      statusColor = "bg-green-500";
      statusText = "Escala Completa";
      statusIcon = CheckCircle2;
    } else if (totalRequired - totalAssigned <= 2) {
      statusColor = "bg-yellow-500";
      statusText = "Poucas vagas restantes";
      statusIcon = Clock;
    }

    return {
      percentage,
      isComplete: totalAssigned >= totalRequired,
      count: totalAssigned,
      total: totalRequired,
      statusColor,
      statusText,
      statusIcon
    };
  };

  const selectedEvent = getEventForDay(selectedDate);
  const selectedAssignments = getAssignmentsForDay(selectedDate);

  // Find the VERY next event from now
  const nextEvent = events
    .filter(e => isAfter(parseISO(e.date), addDays(new Date(), -1)))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleJoinConfirm = () => {
    if (joiningMinistry) {
      onJoinEvent(joiningMinistry.eventId, joiningMinistry.ministry);
      setJoiningMinistry(null);
      setShowSuccess(true);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Legend & Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-gold/10 rounded-[1.25rem] border border-gold/20 shrink-0">
               <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
             </div>
             <div>
               <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black gold-text tracking-tight uppercase">Calendário</h2>
               <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.4em] font-black mt-1">Gestão Ministerial CJPP</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-5 py-4 border-y border-white/5">
             <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Completa</span>
             </div>
             <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Quase lá</span>
             </div>
             <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Vagas</span>
             </div>
             <div className="flex items-center gap-2.5">
               <Star className="w-3 h-3 text-red-900 fill-red-900 animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Santa Ceia</span>
             </div>
             <div className="flex items-center gap-2.5">
               <Sparkles className="w-3 h-3 text-gold animate-bounce" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Próximo Culto</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 glass p-1.5 sm:p-2 rounded-[2rem] border border-white/10 shadow-2xl w-full sm:w-auto">
            <button onClick={prevMonth} className="p-3 hover:bg-white/5 rounded-full transition-all">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-[11px] sm:text-sm font-black uppercase tracking-[0.2em] flex-1 min-w-0 sm:min-w-[180px] text-center font-serif gold-text truncate">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button onClick={nextMonth} className="p-3 hover:bg-white/5 rounded-full transition-all">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto p-4 bg-gold text-black rounded-[1.5rem] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-4 top-10 z-[200] flex justify-center pointer-events-none"
          >
            <div className="bg-black/90 border border-gold/50 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(212,175,55,0.6)] max-w-md text-center backdrop-blur-3xl">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_#D4AF37]">
                <Check className="w-10 h-10 text-black" />
              </div>
              <h4 className="text-gold font-serif text-3xl mb-3">Escala Confirmada!</h4>
              <p className="text-white/80 text-sm mb-8">Tudo pronto para o seu serviço.</p>
              
              <div className="py-8 border-y border-white/10 italic space-y-4">
                <p className="text-base text-white/60">"{currentVerse.text}"</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">{currentVerse.ref}</p>
              </div>
              
              <div className="mt-8">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Obrigado por servir ✨</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-gray-dark border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-6 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
                <div key={day} className="py-2 sm:py-4 text-center text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest sm:tracking-[0.3em]">
                  {day}
                </div>
              ))}
              {days.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const event = getEventForDay(day);
                const occupancy = event ? getOccupancyInfo(event) : null;
                const isCeia = event?.isSantaCeia;
                const isNext = nextEvent && isSameDay(day, parseISO(nextEvent.date));

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative aspect-square md:aspect-video md:h-auto p-2 sm:p-4 transition-all duration-500 rounded-xl sm:rounded-2xl group flex flex-col justify-between border",
                      !isCurrentMonth ? "opacity-10 pointer-events-none" : "hover:scale-[1.03] hover:z-20",
                      isSelected 
                        ? "bg-gold border-gold text-black shadow-[0_0_40px_rgba(212,175,55,0.4)] z-30" 
                        : "bg-black border-white/[0.03] gold-border-hover",
                      isToday && !isSelected && "border-gold/60 ring-2 ring-gold/20",
                      isNext && !isSelected && "shadow-[0_0_15px_rgba(212,175,55,0.15)] border-gold/30"
                    )}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={cn(
                        "text-[10px] sm:text-sm font-black",
                        isSelected ? "text-black" : isToday ? "text-gold" : "text-white/40",
                      )}>
                        {format(day, 'd')}
                      </span>
                      <div className="flex gap-1.5">
                        {isCeia && (
                          <Star className={cn("w-4 h-4 text-red-900 fill-red-900", isSelected ? "text-black/40 fill-black/40" : "animate-pulse")} />
                        )}
                        {isNext && (
                          <Sparkles className={cn("w-4 h-4 text-gold", isSelected ? "text-black/40" : "animate-bounce")} />
                        )}
                      </div>
                    </div>

                    {event && (
                      <div className="space-y-1.5 w-full">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-700", isSelected ? "bg-black/40" : occupancy?.statusColor)} 
                            style={{ width: `${occupancy?.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Culto Featured Block */}
          {nextEvent && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group p-10 rounded-[3.5rem] border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent shadow-[0_0_60px_rgba(212,175,55,0.1)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 pointer-events-none">
                <Sparkles className="w-12 h-12 text-gold/10 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Próximo Culto
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <h3 className="text-4xl font-serif font-black gold-text mb-2 tracking-tight">{nextEvent.title}</h3>
                  <p className="text-xl text-white font-serif opacity-80">
                    {format(parseISO(nextEvent.date), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="flex gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Início</p>
                    <p className="text-2xl font-black text-white">{nextEvent.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Chegada</p>
                    <p className="text-2xl font-black text-gold">{nextEvent.arrivalTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => {
                    setSelectedDate(parseISO(nextEvent.date));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex-1 py-5 bg-gold text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Servir Neste Culto 🚀
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Selected Date Details Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[3.5rem] p-8 border border-white/5 space-y-8 sticky top-20 shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      selectedEvent.isSantaCeia ? "bg-red-900 text-red-100" : "bg-gold/20 text-gold"
                    )}>
                      {selectedEvent.isSantaCeia ? 'Santa Ceia' : 'Culto Regular'}
                    </div>
                    {selectedEvent.isSantaCeia && <Star className="w-6 h-6 text-red-900 fill-red-900 animate-pulse" />}
                  </div>
                  <h3 className="text-3xl font-serif font-black gold-text leading-tight">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-4 text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedEvent.time}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedEvent.teamsNeeded.length} Equipes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Vagas e Escalas</h4>
                    {getOccupancyInfo(selectedEvent).statusIcon && (
                      <div className="flex items-center gap-2">
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", getOccupancyInfo(selectedEvent).statusColor.replace('bg-', 'text-'))}>
                           {getOccupancyInfo(selectedEvent).statusText}
                         </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedEvent.teamsNeeded.map(m => {
                      const teamAssignments = assignments.filter(a => a.eventId === selectedEvent.id && a.ministry === m);
                      const required = MINISTRY_REQUIREMENTS[m] || 1;
                      const isFull = teamAssignments.length >= required;
                      const isUserIn = teamAssignments.some(as => as.volunteerId === currentUser.id);

                      return (
                        <div key={m} className={cn(
                          "group p-5 rounded-[1.75rem] border transition-all duration-500",
                          isFull ? "bg-white/[0.01] border-white/5 opacity-50" : "bg-white/[0.03] border-white/10 hover:border-gold/40"
                        )}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-xl transition-colors", isFull ? "bg-white/5 text-white/40" : "bg-gold/10 text-gold")}>
                                <Users className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white/90">{m}</p>
                                <p className="text-[9px] font-black uppercase tracking-tighter text-white/20 mt-0.5">
                                  {teamAssignments.length}/{required} Voluntários
                                </p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isFull ? "bg-green-500" : teamAssignments.length > 0 ? "bg-yellow-500" : "bg-red-500"
                            )} />
                          </div>

                          {isUserIn ? (
                            <div className="w-full py-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2 text-green-500">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Escalado</span>
                            </div>
                          ) : isFull ? (
                            <div className="w-full py-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-white/20">
                              <span className="text-[9px] font-black uppercase tracking-widest">Escala Completa</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setJoiningMinistry({ eventId: selectedEvent.id, ministry: m })}
                              className="w-full py-3 bg-gold text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              Assumir Vaga
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl italic">
                    <p className="text-[11px] text-white/40 leading-relaxed">Nota da Liderança: {selectedEvent.description}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card rounded-[3.5rem] p-16 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
                  <CalendarIcon className="w-10 h-10 text-white/10" />
                </div>
                <div>
                  <h3 className="text-white/40 font-black uppercase tracking-[0.4em] text-sm">Selecione uma Data</h3>
                  <p className="text-white/10 text-[11px] px-8 leading-relaxed mt-3 uppercase tracking-widest">Toque em um dia com culto para carregar as escalas disponíveis.</p>
                </div>
              </div>
            )}
          </AnimatePresence>

          <button 
            onClick={onAutoSchedule}
            className="w-full py-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white/60 hover:bg-white/5 hover:border-gold/20 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-gold/40" />
            Auto-Preenchimento Inteligente
          </button>
        </div>
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(e) => onAddEvent && onAddEvent(e)}
      />

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {joiningMinistry && (
          <React.Fragment>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed inset-x-4 top-[20%] max-w-sm mx-auto bg-gray-dark border border-gold/30 rounded-[3.5rem] p-10 z-[151] shadow-2xl space-y-8"
            >
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <Star className="w-10 h-10 text-gold" />
              </div>
              <div className="text-center">
                <h4 className="text-3xl font-serif gold-text tracking-tight mb-2">Confirmar Escala</h4>
                <p className="text-sm text-white/40 font-serif italic">"Eu vim para servir, não para ser servido."</p>
              </div>
              
              <div className="bg-black/40 rounded-[2.5rem] p-8 space-y-5 border border-white/5">
                {[
                  { label: 'Ministério', value: joiningMinistry.ministry, highlight: true },
                  { label: 'Data', value: format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) },
                  { label: 'Chegada', value: selectedEvent?.arrivalTime || '--:--', highlight: true },
                  { label: 'Início', value: selectedEvent?.time || '--:--' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-white/30 uppercase font-black tracking-widest">{item.label}</span>
                    <span className={cn("text-white font-black uppercase tracking-widest", item.highlight && "text-gold")}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleJoinConfirm}
                  className="w-full py-5 bg-gold text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirmar Escala 🚀
                </button>
                <button 
                  onClick={() => setJoiningMinistry(null)}
                  className="w-full py-4 text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-all underline underline-offset-8"
                >
                  Voltar e Revisar
                </button>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}
