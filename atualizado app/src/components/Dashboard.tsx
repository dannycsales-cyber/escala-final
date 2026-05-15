import React from 'react';
import { 
  Users, 
  Clock,
  CheckCircle2,
  Mail,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Volunteer, Assignment, ChurchEvent } from '../types';
import { cn } from '../lib/utils';

const data = [
  { name: 'Seg', v: 45 },
  { name: 'Ter', v: 52 },
  { name: 'Qua', v: 48 },
  { name: 'Qui', v: 61 },
  { name: 'Sex', v: 55 },
  { name: 'Sáb', v: 67 },
  { name: 'Dom', v: 80 },
];

interface DashboardProps {
  volunteers: Volunteer[];
  assignments: Assignment[];
  events: ChurchEvent[];
  onAutoSchedule: () => void;
  currentUser: Volunteer;
}

export default function Dashboard({ volunteers, assignments, events, onAutoSchedule, currentUser }: DashboardProps) {
  const stats = [
    { label: 'Voluntários Ativos', val: volunteers.length.toString(), icon: Users, trend: '+5%', color: 'text-gold' },
    { label: 'Escalas Confirmadas', val: assignments.filter(a => a.status === 'confirmed').length.toString(), icon: CheckCircle2, trend: '85%', color: 'text-green-400' },
    { label: 'Escalas Pendentes', val: assignments.filter(a => a.status === 'assigned').length.toString(), icon: Clock, trend: '15%', color: 'text-gold' },
    { label: 'Próximo Culto', val: 'Sáb 23h', icon: Clock, trend: 'Vigília', color: 'text-blue-400' },
  ];

  const notificationLogs = [
    { id: 1, user: 'Dani Sales', type: 'Lembrete (1 dia)', status: 'sent', time: 'Há 2 horas', event: 'Culto de Domingo' },
    { id: 2, user: 'João Silva', type: 'Confirmação', status: 'confirmed', time: 'Há 5 horas', event: 'Culto de Quarta-feira' },
    { id: 3, user: 'Maria Santos', type: 'Cancelamento', status: 'cancelled', time: 'Há 8 horas', event: 'Culto de Domingo' },
    { id: 4, user: 'Pedro Souza', type: 'Lembrete (3 horas)', status: 'sent', time: 'Há 12 horas', event: 'Vigília' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold gold-text">Dashboard Ministerial</h2>
          <p className="text-white/70 mt-1 text-sm sm:text-base">Olá {currentUser.name}, bem-vindo à gestão ministerial da CJPP.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onAutoSchedule}
            className="w-full sm:w-auto px-6 py-3 btn-gold rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            ✨ Preenchimento Automático
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-gray-dark border border-gray-med p-5 rounded-lg hover:bg-gray-med/30 transition-all group">
            <div className="flex items-center justify-between mb-5">
              <div className="p-2.5 bg-black/60 rounded-xl group-hover:scale-110 transition-transform shadow-inner ring-1 ring-white/10">
                <item.icon className={cn("w-6 h-6 shadow-[0_0_10px_rgba(255,255,255,0.1)]", item.color)} />
              </div>
              <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full text-white font-black drop-shadow-lg">{item.trend}</span>
            </div>
            <p className="text-white font-bold text-[11px] uppercase tracking-[0.2em] opacity-90">{item.label}</p>
            <p className="text-3xl font-serif font-black mt-2 text-white drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ministry Occupancy */}
        <div className="bg-gray-dark border border-gray-med rounded-xl p-6">
          <h3 className="font-serif text-xl gold-text mb-6">Ocupação por Ministério</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="v" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notificações Enviadas (Admin) */}
        <div className="bg-gray-dark border border-gray-med rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl gold-text">Notificações Enviadas</h3>
            <Mail className="w-4 h-4 text-white/20" />
          </div>
          <div className="space-y-4">
            {notificationLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-black/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    log.status === 'confirmed' ? "bg-green-500/10 text-green-500" :
                    log.status === 'cancelled' ? "bg-red-500/10 text-red-500" :
                    "bg-gold/10 text-gold"
                  )}>
                    {log.status === 'confirmed' ? <CheckCircle className="w-4 h-4" /> :
                     log.status === 'cancelled' ? <XCircle className="w-4 h-4" /> :
                     <ClockIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5">{log.user}</p>
                    <p className="text-[10px] text-white/70 font-medium">{log.type} • {log.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gold/80 uppercase tracking-wider">{log.time}</p>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter",
                    log.status === 'confirmed' ? "text-green-500" :
                    log.status === 'cancelled' ? "text-red-500" : "text-gold"
                  )}>
                    {log.status === 'confirmed' ? 'Confirmado' :
                     log.status === 'cancelled' ? 'Cancelado' : 'Enviado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-all">
            Ver Log Completo
          </button>
        </div>
      </div>
    </div>
  );
}
