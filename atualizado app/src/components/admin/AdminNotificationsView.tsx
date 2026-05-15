import React from 'react';
import { 
  Bell, 
  Send, 
  Target, 
  Users, 
  Building2, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  History,
  MessageSquare
} from 'lucide-react';
import { Ministry, Notification } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminNotificationsViewProps {
  onSendNotification: (n: Partial<Notification>, target: string | string[]) => void;
}

export default function AdminNotificationsView({ onSendNotification }: AdminNotificationsViewProps) {
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [targetType, setTargetType] = React.useState<'ALL' | 'MINISTRY' | 'INDIVIDUAL'>('ALL');
  const [selectedMinistry, setSelectedMinistry] = React.useState<Ministry | ''>('');
  const [isSending, setIsSending] = React.useState(false);

  const ministries: Ministry[] = ['ESTACIONAMENTO', 'RECEPÇÃO', 'COZINHA', 'KIDS', 'MÍDIA', 'CAPITÃO', 'APOIO TEMPLO'];

  const handleSend = () => {
    if (!title || !message) return;
    setIsSending(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSendNotification({ title, message, type: 'reminder' }, targetType === 'MINISTRY' ? selectedMinistry : 'ALL');
      setIsSending(false);
      setTitle('');
      setMessage('');
      // Toast success could go here
    }, 1500);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-4xl font-serif font-black gold-text tracking-tight italic">Centro de Comunicações</h2>
           <p className="text-white/60 text-sm font-medium">Envie avisos, convocações e alertas para o corpo ministerial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* COMPOSE SECTION */}
        <div className="lg:col-span-12 space-y-8">
           <div className="glass-premium p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden bg-white/[0.02] shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              <div className="absolute -right-20 -bottom-20 opacity-5">
                 <Bell className="w-80 h-80" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Público Alvo</h4>
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'ALL', label: 'Todos', icon: Users },
                            { id: 'MINISTRY', label: 'Ministério', icon: Building2 },
                            { id: 'INDIVIDUAL', label: 'Pessoa', icon: Target },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTargetType(t.id as any)}
                              className={cn(
                                "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                                targetType === t.id 
                                  ? "bg-gold/10 border-gold text-gold shadow-lg" 
                                  : "bg-black/40 border-white/5 text-white/40 hover:border-white/10"
                              )}
                            >
                               <t.icon className="w-6 h-6" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    <AnimatePresence>
                      {targetType === 'MINISTRY' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                           <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Selecionar Ministério</h4>
                           <div className="grid grid-cols-2 gap-2">
                             {ministries.map(min => (
                               <button
                                 key={min}
                                 onClick={() => setSelectedMinistry(min)}
                                 className={cn(
                                   "px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest text-left transition-all",
                                   selectedMinistry === min ? "bg-gold text-black border-gold" : "bg-black/40 border-white/5 text-white/40 hover:border-gold/30 hover:text-white"
                                 )}
                               >
                                 {min}
                               </button>
                             ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Prioridade</h4>
                       <div className="flex gap-4">
                          <button className="flex-1 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-white/40 uppercase tracking-widest hover:border-gold/30 hover:text-white transition-all">Normal</button>
                          <button className="flex-1 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[9px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500/20 transition-all">Atenção</button>
                          <button className="flex-1 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/20 transition-all">Crítico</button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Assunto do Comunicado</h4>
                          <div className="relative group border-b-2 border-white/20 focus-within:border-gold transition-all pb-4">
                             <input 
                               type="text" 
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               placeholder="EX: CHAMADA PARA CULTO ESPECIAL"
                               className="w-full bg-transparent py-2 outline-none text-xl text-white placeholder:text-white/10 font-serif italic"
                             />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-1">Corpo da Mensagem</h4>
                          <div className="relative group">
                             <textarea 
                               rows={6}
                               value={message}
                               onChange={(e) => setMessage(e.target.value)}
                               placeholder="ESCREVA AQUI O CONTEÚDO DO AVISO..."
                               className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm text-white placeholder:text-white/10 outline-none focus:border-gold/30 transition-all resize-none"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-6">
                       <button 
                         onClick={() => { setTitle(''); setMessage(''); }}
                         className="flex-1 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                       >
                         LIMPAR
                       </button>
                       <button 
                         onClick={handleSend}
                         disabled={isSending || !title || !message}
                         className={cn(
                           "flex-[2] py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-3",
                           isSending ? "bg-gold/40 text-black/40" : "btn-premium-gold"
                         )}
                       >
                         {isSending ? (
                           <>
                             <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                             ENVIANDO...
                           </>
                         ) : (
                           <>
                             <Send className="w-4 h-4" />
                             DISPARAR COMUNICADO
                           </>
                         )}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* LOGS SECTION */}
        <div className="lg:col-span-12 space-y-6">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2">Histórico de Disparos</h4>
              <button className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all">
                <History className="w-4 h-4" />
                Ver Mais
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Lembrete Ceia do Senhor', target: 'TODOS', date: 'Há 2 horas', reads: 145 },
                { title: 'Vaga Urgente Estacionamento', target: 'ESTACIONAMENTO', date: 'Há 5 horas', reads: 12 },
                { title: 'Reunião Geral Líderes', target: 'LÍDERES', date: 'Ontem', reads: 22 },
              ].map((log, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gold/10 rounded-xl">
                         <MessageSquare className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{log.date}</span>
                   </div>
                   <h5 className="font-serif font-black text-white text-lg leading-tight group-hover:gold-text transition-all">{log.title}</h5>
                   <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                      <p className="text-[9px] font-black text-gold/40 uppercase tracking-widest">{log.target}</p>
                      <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3 text-green-500/40" />
                         {log.reads} Visualizações
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
