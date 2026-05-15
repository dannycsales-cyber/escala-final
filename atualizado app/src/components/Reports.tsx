import React from 'react';
import { 
  FileText, 
  UserX, 
  Calendar, 
  ArrowRight,
  Download,
  AlertTriangle
} from 'lucide-react';
import { format, subDays, isBefore, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { Volunteer } from '../types';

interface ReportsProps {
  volunteers: Volunteer[];
}

export default function Reports({ volunteers }: ReportsProps) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const inactiveVolunteers = volunteers.filter(v => {
    if (!v.lastServedAt) return true; // Never served is considered inactive
    return isBefore(parseISO(v.lastServedAt), thirtyDaysAgo);
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold gold-text">Relatórios de Gestão</h2>
        <p className="text-white/40 mt-1">Análise estratégica do corpo de voluntários.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-dark border border-gray-med p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-white/80">Alerta de Inatividade</h3>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-light text-white">{inactiveVolunteers.length}</p>
              <p className="text-xs text-white/40 font-medium">Voluntários há +30 dias sem servir</p>
            </div>
            <div className="mt-6 p-4 bg-black/40 border border-white/5 rounded-lg flex gap-3">
              <AlertTriangle className="w-4 h-4 text-gold shrink-0" />
              <p className="text-[10px] text-white/60 leading-relaxed italic">
                "Recomendamos que a liderança entre em contato com estes irmãos para entender o motivo do afastamento."
              </p>
            </div>
            <button className="w-full mt-6 py-3 btn-gold rounded-lg text-[10px] uppercase tracking-widest font-black shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Notificar Todos via WhatsApp
            </button>
          </div>

          <div className="bg-gray-dark border border-gray-med p-6 rounded-lg">
            <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Outros Relatórios</h3>
            <div className="space-y-2">
              {['Engajamento por Equipe', 'Crescimento Mensal', 'Estatísticas de Presença'].map(report => (
                <button key={report} className="w-full flex items-center justify-between p-3 bg-black/20 rounded-lg text-xs text-white/60 hover:text-gold hover:bg-gold-dim transition-all group">
                  <span>{report}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of Inactive Volunteers */}
        <div className="lg:col-span-2 bg-gray-dark border border-gray-med rounded-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-med flex items-center justify-between">
            <h3 className="font-serif text-xl gold-text">Inativos (+30 dias)</h3>
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <tr>
                  <th className="px-6 py-4">Voluntário</th>
                  <th className="px-6 py-4">Equipe</th>
                  <th className="px-6 py-4">Última Vez</th>
                  <th className="px-6 py-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inactiveVolunteers.map(vol => (
                  <tr key={vol.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gold-dim border border-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">
                          {vol.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{vol.name}</p>
                          <p className="text-[9px] text-white/30 truncate max-w-[120px]">{vol.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-gold/60 uppercase">{vol.ministries[0]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium whitespace-nowrap">
                          {vol.lastServedAt 
                            ? format(parseISO(vol.lastServedAt), "dd/MM/yyyy", { locale: ptBR })
                            : 'Nunca serviu'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[10px] font-bold text-gold hover:underline uppercase tracking-widest">
                        Conversar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
