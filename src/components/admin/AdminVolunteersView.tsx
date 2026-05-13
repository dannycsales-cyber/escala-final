import React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserMinus, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Volunteer, Assignment, Ministry } from '../../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminVolunteersViewProps {
  volunteers: Volunteer[];
  assignments: Assignment[];
}

export default function AdminVolunteersView({ volunteers, assignments }: AdminVolunteersViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterMinistry, setFilterMinistry] = React.useState<Ministry | 'ALL'>('ALL');
  const [selectedVolunteer, setSelectedVolunteer] = React.useState<Volunteer | null>(null);

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.phone.includes(searchTerm);
    const matchesMinistry = filterMinistry === 'ALL' || v.ministries.includes(filterMinistry);
    return matchesSearch && matchesMinistry;
  });

  const getParticipationFrequency = (volunteerId: string) => {
    const totalAssignments = assignments.filter(a => a.volunteerId === volunteerId).length;
    // Mocking a percentage for demo purposes
    return Math.min(100, totalAssignments * 15); 
  };

  const isAbsentLong = (lastServedAt?: string) => {
    if (!lastServedAt) return true;
    return differenceInDays(new Date(), parseISO(lastServedAt)) >= 30;
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-0">
        <div className="space-y-4">
           <h2 className="text-2xl sm:text-4xl font-serif font-black gold-text tracking-tight italic uppercase">Corpo de Voluntários</h2>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl sm:text-3xl font-black">{volunteers.length}</span>
               <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-black leading-none">Membros<br/>Ativos</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-red-500 text-2xl sm:text-3xl font-black">{volunteers.filter(v => isAbsentLong(v.lastServedAt)).length}</span>
               <span className="text-[9px] sm:text-[10px] text-red-500/40 uppercase tracking-widest font-black leading-none">Ausentes<br/>+30d</span>
             </div>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative group w-full sm:max-w-xs">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
             <input 
               type="text" 
               placeholder="BUSCAR NOME OU TELEFONE..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full sm:w-64 bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest placeholder:text-white/10 focus:border-gold/30 outline-none transition-all"
             />
           </div>
           <button className="w-full sm:w-auto p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-gold hover:bg-white/10 transition-all flex items-center justify-center">
             <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* TABLE/GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map((vol) => {
          const frequency = getParticipationFrequency(vol.id);
          const absent = isAbsentLong(vol.lastServedAt);

          return (
            <motion.div
              layout
              key={vol.id}
              className={cn(
                "group glass-premium rounded-[2.5rem] border transition-all p-8 relative overflow-hidden",
                absent ? "border-red-500/10 hover:border-red-500/40" : "border-white/5 hover:border-gold/30"
              )}
            >
              {absent && (
                <div className="absolute top-6 right-6 p-2 bg-red-500/10 rounded-xl text-red-500">
                  <UserMinus className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-start gap-6 mb-8">
                 <div className="w-16 h-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center font-serif text-3xl font-black gold-text shadow-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                    {vol.name.slice(0, 1)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-serif font-black text-white truncate group-hover:gold-text transition-colors">{vol.name}</h3>
                    <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] mt-1 italic">{vol.primaryRole}</p>
                    <div className="flex items-center gap-4 mt-3">
                       <div className="flex items-center gap-2 text-white/40">
                          <Phone className="w-3 h-3" />
                          <span className="text-[9px] font-bold">{vol.phone}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                         <Star className="w-3 h-3 text-gold/40" />
                         <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Frequência</p>
                       </div>
                       <div className="flex items-end justify-between">
                         <p className="text-xl font-black text-white">{frequency}%</p>
                         <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden mb-1.5 shrink-0">
                            <div className="h-full bg-gold" style={{ width: `${frequency}%` }} />
                         </div>
                       </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                         <Clock className="w-3 h-3 text-gold/40" />
                         <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Último Serviço</p>
                       </div>
                       <p className="text-sm font-bold text-white/90">
                         {vol.lastServedAt ? format(parseISO(vol.lastServedAt), 'dd/MM/yy') : 'NUNCA'}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center flex-wrap gap-2">
                    {vol.ministries.map(m => (
                      <span key={m} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40">
                        {m}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      absent ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-green-500 shadow-[0_0_8px_#22c55e]"
                    )} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                       {absent ? 'Inativo há 30+ dias' : 'Participante Ativo'}
                    </span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-gold hover:bg-white/10 transition-all">
                       <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-gold hover:bg-white/10 transition-all">
                       <MoreVertical className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NO RESULTS */}
      {filteredVolunteers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] text-white/10 text-2xl italic font-serif">
           Nenhum voluntário encontrado para "{searchTerm}"
        </div>
      )}
    </div>
  );
}
