import React from 'react';
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Users, 
  Calendar, 
  Target, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Volunteer, Assignment } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface AdminReportsViewProps {
  volunteers: Volunteer[];
  assignments: Assignment[];
}

export default function AdminReportsView({ volunteers, assignments }: AdminReportsViewProps) {
  // Engagement Data
  const engagementData = [
    { name: 'Jan', val: 45 },
    { name: 'Fev', val: 52 },
    { name: 'Mar', val: 48 },
    { name: 'Abr', val: 61 },
    { name: 'Mai', val: 55 },
    { name: 'Jun', val: 67 },
  ];

  const ministryDistribution = [
    { name: 'Mídia', value: 30, color: '#D4AF37' },
    { name: 'Recepção', value: 25, color: '#FFFFFF' },
    { name: 'Kids', value: 20, color: '#444444' },
    { name: 'Apoio', value: 25, color: '#222222' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-0">
        <div className="space-y-2">
           <h2 className="text-2xl sm:text-4xl font-serif font-black gold-text tracking-tight italic">Relatórios Estratégicos</h2>
           <p className="text-white/60 text-[10px] sm:text-sm font-medium uppercase tracking-widest leading-relaxed">Inteligência de Dados para Gestão de Voluntários</p>
        </div>
        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:border-gold/40 transition-all flex items-center justify-center gap-3">
          <Download className="w-4 h-4 text-gold" />
          Exportar Relatório Anual (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-0">
        {[
          { label: 'Engajamento Médio', val: '84%', trend: '+12%', up: true, icon: Target },
          { label: 'Novos Voluntários', val: '12', trend: '+4', up: true, icon: Users },
          { label: 'Taxa de Ausência', val: '5.2%', trend: '-1.2%', up: false, icon: Info },
          { label: 'Eventos Realizados', val: '24', trend: '+2', up: true, icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="glass-premium p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 flex flex-col justify-between h-40 sm:h-48 group">
            <div className="flex items-center justify-between">
               <div className="p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl group-hover:bg-gold/10 transition-all">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
               </div>
               <div className={cn(
                 "flex items-center gap-1 text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-full",
                 stat.up ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
               )}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
               </div>
            </div>
            <div>
               <p className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
               <p className="text-xl sm:text-3xl font-serif font-black text-white mt-1 italic">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Engagement Chart */}
        <div className="lg:col-span-8 glass-premium p-10 rounded-[3rem] border border-white/10 h-96 flex flex-col">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black text-gold uppercase tracking-[0.4em]">Frequência Ministerial (Últimos 6 meses)</h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-gold rounded-full" />
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Comparecimento %</span>
              </div>
           </div>
           <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    unit="%"
                  />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ 
                      backgroundColor: '#111', 
                      borderRadius: '20px', 
                      border: '1px solid #ffffff10',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  />
                  <Bar 
                    dataKey="val" 
                    fill="url(#barGradient)" 
                    radius={[10, 10, 0, 0]} 
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Ministry Dist Chart */}
        <div className="lg:col-span-4 glass-premium p-10 rounded-[3rem] border border-white/10 h-96 flex flex-col">
           <h3 className="text-xs font-black text-gold uppercase tracking-[0.4em] mb-10">Distribuição por Ministério</h3>
           <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ministryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ministryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111', 
                      borderRadius: '20px', 
                      border: '1px solid #ffffff10',
                      fontSize: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-xs font-serif italic text-white/40">Total</p>
                 <p className="text-2xl font-black text-white">{volunteers.length}</p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-6">
              {ministryDistribution.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{entry.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-premium p-10 rounded-[3rem] border border-white/10">
           <h3 className="text-xs font-black text-gold uppercase tracking-[0.4em] mb-8">Alertas de Saúde Ministerial</h3>
           <div className="space-y-4">
              {[
                { label: 'Baixa retenção em Kids', desc: 'Sugerimos novos treinamentos e integração.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Excesso de dobras em Mídia', desc: 'Equipe está sobrecarregada nos domingos.', color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Crescimento em Recepção', desc: 'Time atingiu meta semestral em 3 meses.', color: 'text-green-500', bg: 'bg-green-500/10' },
              ].map((alert, i) => (
                <div key={i} className={cn("p-6 rounded-[2rem] border animate-pulse", alert.bg, alert.color.replace('text', 'border'))}>
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-black uppercase tracking-widest leading-none">{alert.label}</p>
                   </div>
                   <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest font-black opacity-60">{alert.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-premium p-10 rounded-[3rem] border border-white/10">
           <h3 className="text-xs font-black text-gold uppercase tracking-[0.4em] mb-8">Ranking de Engajamento</h3>
           <div className="space-y-4">
              {volunteers.slice(0, 4).map((v, i) => (
                <div key={v.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-black text-xs">
                         #{i + 1}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white group-hover:gold-text transition-all leading-none">{v.name}</p>
                         <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1 font-black">{v.primaryRole}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-white leading-none">9{8 - i}%</p>
                         <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mt-1">Consistency</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/10" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
