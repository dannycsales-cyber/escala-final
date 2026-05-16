import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Volunteer, Ministry } from '../types';

interface VolunteerListProps {
  volunteers: Volunteer[];
}

export default function VolunteerList({ volunteers }: VolunteerListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold gold-text">Corpo de Voluntários</h2>
          <p className="text-white/70 mt-1 font-medium">Gerencie a equipe que faz acontecer no Reino.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 btn-gold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-5 h-5" />
          Novo Voluntário
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou ministério..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-gold-500/50 transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((vol) => (
          <div key={vol.id} className="bg-gray-dark border border-gray-med transition-all overflow-hidden group rounded-lg">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-gold-dim border border-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                  {vol.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-white group-hover:gold-text transition-all tracking-tight">{vol.name}</h4>
                  <p className="text-[12px] text-gold font-bold uppercase tracking-widest mt-1">{vol.primaryRole}</p>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
                  <MoreHorizontal className="w-5 h-5 text-white/30" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Phone className="w-4 h-4 text-gold" />
                  {vol.phone}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {vol.ministries.map((min, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 bg-gold-dim text-gold border border-gold/10 rounded font-bold uppercase tracking-wider">
                      {min}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex border-t border-gray-med">
              <button className="flex-1 py-3 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <CalendarIcon className="w-3 h-3 text-gold" />
                Escalar
              </button>
              <div className="w-px h-full bg-gray-med" />
              <button className="flex-1 py-3 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
                Perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
