import React from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  UserMinus, 
  ClipboardList, 
  Repeat,
  ArrowRight
} from 'lucide-react';
import { ChurchEvent, Assignment, Volunteer } from '../../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { cn } from '../../lib/utils';

interface AdminDashboardProps {
  events: ChurchEvent[];
  assignments: Assignment[];
  volunteers: Volunteer[];
  onNavigate: (view: string) => void;
}

export default function AdminDashboard({ events, assignments, volunteers, onNavigate }: AdminDashboardProps) {
  // Statistics Logic
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  
  const incompleteScales = events.filter(e => {
    if (new Date(e.date) < new Date()) return false;
    const assigned = assignments.filter(a => a.eventId === e.id).length;
    // Simple heuristic: if less than 5 people, it's likely incomplete for a major service
    return assigned < 10; 
  }).length;

  const confirmedToday = assignments.filter(a => a.status === 'confirmed').length;
  
  const absentVolunteers = volunteers.filter(v => {
    if (!v.lastServedAt) return true;
    return differenceInDays(new Date(), parseISO(v.lastServedAt)) >= 30;
  }).length;

  const replacementRequests = assignments.filter(a => a.status === 'open').length;

  const stats = [
    { label: 'Serviços Próximos', val: upcomingEvents, icon: Calendar, color: 'text-blue-400', view: 'scales' },
    { label: 'Escalas Incompletas', val: incompleteScales, icon: AlertCircle, color: 'text-amber-400', view: 'scales' },
    { label: 'Voluntários Confirmados', val: confirmedToday, icon: CheckCircle2, color: 'text-green-400', view: 'volunteers' },
    { label: 'Ausentes (+30 dias)', val: absentVolunteers, icon: UserMinus, color: 'text-red-400', view: 'volunteers' },
    { label: 'Pedidos Substituição', val: replacementRequests, icon: Repeat, color: 'text-purple-400', view: 'scales' },
    { label: 'Pendentes Confirmação', val: assignments.filter(a => a.status === 'assigned').length, icon: ClipboardList, color: 'text-gold', view: 'volunteers' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-serif font-black gold-text tracking-tight">Overview Administrativo</h2>
          <p className="text-white/60 text-xs sm:text-sm font-medium">Controle total dos ministérios e escalas CJPP.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Exportar Relatórios</button>
          <button 
            onClick={() => onNavigate('scales')}
            className="w-full sm:w-auto px-6 py-3 btn-premium-gold rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl"
          >
            Nova Escala
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.view)}
            className="group bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-[2rem] text-left hover:bg-white/5 transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-24 sm:w-32 h-24 sm:h-32" />
            </div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className={cn("p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 ring-1 ring-white/10", stat.color)}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/10 group-hover:text-gold transition-colors" />
            </div>

            <div className="mt-6 sm:mt-8 space-y-1 relative z-10">
              <p className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">{stat.label}</p>
              <p className="text-2xl sm:text-4xl font-serif font-black text-white">{stat.val}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity or Warnings could go here */}
        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/10">
          <h3 className="text-lg font-serif font-bold text-white mb-6">Alertas Críticos</h3>
          <div className="space-y-4">
             {absentVolunteers > 0 && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                 <UserMinus className="w-5 h-5 text-red-500" />
                 <div>
                   <p className="text-xs font-bold text-white leading-none">{absentVolunteers} voluntários sumidos</p>
                   <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Inativos há mais de 30 dias</p>
                 </div>
               </div>
             )}
             {replacementRequests > 0 && (
               <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-4">
                 <Repeat className="w-5 h-5 text-purple-500" />
                 <div>
                   <p className="text-xs font-bold text-white leading-none">{replacementRequests} vagas em aberto</p>
                   <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Aguardando voluntários</p>
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/10">
          <h3 className="text-lg font-serif font-bold text-white mb-6">Próximos Cultos</h3>
          <div className="space-y-4">
             {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map(event => (
               <div key={event.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                 <div>
                   <p className="text-xs font-bold text-white leading-none">{event.title}</p>
                   <p className="text-[10px] text-gold/60 mt-1 uppercase tracking-widest">{format(parseISO(event.date), 'dd/MM/yyyy')}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Escala</p>
                   <p className="text-xs font-bold text-white">{assignments.filter(a => a.eventId === event.id).length} / 12</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
