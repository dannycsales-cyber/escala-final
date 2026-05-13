import React from 'react';
import { 
  Building2, 
  Users, 
  Settings2, 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  UserPlus, 
  X, 
  Mail, 
  MoreHorizontal 
} from 'lucide-react';
import { Ministry, Volunteer, MINISTRY_REQUIREMENTS } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminMinistryViewProps {
  volunteers: Volunteer[];
}

export default function AdminMinistryView({ volunteers }: AdminMinistryViewProps) {
  const [selectedMinistry, setSelectedMinistry] = React.useState<Ministry | null>(null);

  const ministriesList = Object.keys(MINISTRY_REQUIREMENTS) as Ministry[];

  const getVolunteersForMinistry = (m: Ministry) => {
    return volunteers.filter(v => v.ministries.includes(m));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-2xl sm:text-4xl font-serif font-black gold-text tracking-tight">Gestão de Ministérios</h2>
           <p className="text-white/60 text-xs sm:text-sm font-medium">Configure e gerencie as frentes de serviço da CJPP.</p>
        </div>
        <button className="w-full sm:w-auto px-6 py-4 btn-premium-gold rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Ministério
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
        {ministriesList.map((min) => {
          const members = getVolunteersForMinistry(min);
          const isSelected = selectedMinistry === min;

          return (
            <motion.button
              layout
              key={min}
              onClick={() => setSelectedMinistry(isSelected ? null : min)}
              className={cn(
                "group p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all relative overflow-hidden text-left shadow-2xl",
                isSelected 
                  ? "bg-white/[0.05] border-gold ring-2 ring-gold/20" 
                  : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
              )}
            >
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <Building2 className="w-32 sm:w-40 h-32 sm:h-40" />
              </div>

              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-black/40 rounded-xl sm:rounded-2xl ring-1 ring-white/10 text-gold shadow-lg">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex -space-x-2 sm:-space-x-3">
                   {members.slice(0, 3).map((m, i) => (
                     <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black bg-gold text-black flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-md">
                       {m.name.slice(0, 1)}
                     </div>
                   ))}
                   {members.length > 3 && (
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black bg-white/10 text-white/40 flex items-center justify-center font-black text-[9px] sm:text-[10px]">
                       +{members.length - 3}
                     </div>
                   )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                   <h3 className="text-lg sm:text-xl font-serif font-black text-white">{min}</h3>
                   <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black mt-1">Estratégico</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                      <p className="text-[7px] sm:text-[8px] text-white/20 uppercase font-black tracking-widest">Slots/Service</p>
                      <p className="text-base sm:text-lg font-bold text-white">{MINISTRY_REQUIREMENTS[min]}</p>
                   </div>
                   <div className="bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                      <p className="text-[7px] sm:text-[8px] text-white/20 uppercase font-black tracking-widest">Ativos</p>
                      <p className="text-base sm:text-lg font-bold text-white">{members.length}</p>
                   </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-between">
                 <span className={cn(
                   "px-3 py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest",
                   members.length >= (MINISTRY_REQUIREMENTS[min] * 3) ? "bg-green-500/10 text-green-500" : "bg-gold/10 text-gold"
                 )}>
                   {members.length >= (MINISTRY_REQUIREMENTS[min] * 3) ? 'Equipe Completa' : 'Faltam Voluntários'}
                 </span>
                 <ChevronRight className={cn("w-4 h-4 sm:w-5 h-5 transition-transform", isSelected ? "rotate-90 text-gold" : "text-white/10")} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedMinistry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-premium p-10 rounded-[3rem] border border-white/10 mt-12 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-gold rounded-3xl flex items-center justify-center text-black shadow-lg">
                    <Building2 className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-4xl font-serif font-black text-white italic">{selectedMinistry}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-[0.4em] font-black mt-2">Detalhamento da Frente de Serviço</p>
                 </div>
               </div>
               <button 
                 onClick={() => setSelectedMinistry(null)}
                 className="p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-all text-white/20 hover:text-white"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Left Column: Management */}
               <div className="lg:col-span-1 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Configurações Rápidas</h4>
                    <div className="space-y-3">
                       <button className="w-full p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <Settings2 className="w-5 h-5 text-white/20 group-hover:text-gold transition-colors" />
                             <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-widest">Ajustar Vagas</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/10" />
                       </button>
                       <button className="w-full p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <UserPlus className="w-5 h-5 text-white/20 group-hover:text-gold transition-colors" />
                             <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-widest">Incluir Voluntário</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/10" />
                       </button>
                       <button className="w-full p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between group hover:bg-red-500/10 transition-all">
                          <div className="flex items-center gap-4">
                             <X className="w-5 h-5 text-red-500/40 group-hover:text-red-500" />
                             <span className="text-xs font-bold text-red-500/60 group-hover:text-red-500 uppercase tracking-widest">Fechar Posição</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/10" />
                       </button>
                    </div>
                  </div>

                  <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                     <ShieldCheck className="absolute -right-8 -bottom-8 w-32 h-32 text-gold/5" />
                     <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-4">Meta do Ministéiro</h4>
                     <p className="text-2xl font-serif font-black text-white">{getVolunteersForMinistry(selectedMinistry).length} / {MINISTRY_REQUIREMENTS[selectedMinistry] * 4}</p>
                     <p className="text-xs text-white/40 mt-2 leading-relaxed">Considerando uma rotatividade saudável de 4 equipes para este cargo.</p>
                     <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (getVolunteersForMinistry(selectedMinistry).length / (MINISTRY_REQUIREMENTS[selectedMinistry] * 4)) * 100)}%` }}
                          className="h-full bg-gold shadow-[0_0_15px_#D4AF37]"
                        />
                     </div>
                  </div>
               </div>

               {/* Right Column: Volunteers List */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Lista de Voluntários Ativos</h4>
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{getVolunteersForMinistry(selectedMinistry).length} PESSOAS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto no-scrollbar pr-4">
                     {getVolunteersForMinistry(selectedMinistry).map((vol) => (
                       <div key={vol.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all group flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black gold-text text-xl shadow-inner ring-1 ring-white/10">
                             {vol.name.slice(0, 1)}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-lg font-serif font-bold text-white truncate">{vol.name}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  vol.lastServedAt ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                )} />
                                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">
                                   {vol.lastServedAt ? 'Disponível' : 'Pendente Cadastro'}
                                </p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-gold transition-all">
                                <Mail className="w-4 h-4" />
                             </button>
                             <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-gold transition-all">
                                <MoreHorizontal className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
