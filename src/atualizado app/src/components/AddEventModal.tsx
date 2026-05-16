import React from 'react';
import { X, Calendar, Clock, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ministry, ChurchEvent } from '../types';
import { MINISTRY_REQUIREMENTS } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: ChurchEvent) => void;
}

const MINISTRIES: Ministry[] = ['CAPITÃO', 'APOIO TEMPLO', 'RECEPÇÃO', 'ESTACIONAMENTO', 'COZINHA', 'KIDS', 'MÍDIA', 'DANÇA'];

export default function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [arrivalTime, setArrivalTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState<'recurrent' | 'special'>('special');
  const [selectedMinistries, setSelectedMinistries] = React.useState<Ministry[]>([]);
  const [isSantaCeia, setIsSantaCeia] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    const newEvent: ChurchEvent = {
      id: `e-manual-${Date.now()}`,
      title,
      date,
      time,
      arrivalTime: arrivalTime || time, // fallback
      type,
      status: 'published',
      description,
      teamsNeeded: selectedMinistries,
      isSantaCeia
    };

    onAdd(newEvent);
    onClose();
    // Reset
    setTitle('');
    setDate('');
    setTime('');
    setArrivalTime('');
    setSelectedMinistries([]);
    setIsSantaCeia(false);
  };

  const toggleMinistry = (m: Ministry) => {
    setSelectedMinistries(prev => 
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] max-w-lg mx-auto bg-black border border-white/10 rounded-[2.5rem] z-[111] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
          >
            <header className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif gold-text">Criar Novo Evento</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Configuração Ministerial</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <X className="w-6 h-6 text-white/40" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold uppercase tracking-widest">Nome do Evento</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Conferência de Jovens"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-gold/40 text-white placeholder:text-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest">Data</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-gold/40 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest">Horário Culto</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-gold/40 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest">Chegada Equipe</label>
                  <input 
                    type="time" 
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-gold/40 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest">Especial</label>
                  <div className="flex bg-white/5 rounded-2xl p-1">
                    <button 
                      type="button"
                      onClick={() => setIsSantaCeia(!isSantaCeia)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isSantaCeia ? 'bg-gold text-black' : 'text-white/40'}`}
                    >
                      <Star className="w-3 h-3" />
                      Santa Ceia
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gold uppercase tracking-widest">Ministérios Necessários</label>
                <div className="flex flex-wrap gap-2">
                  {MINISTRIES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMinistry(m)}
                      className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                        selectedMinistries.includes(m) 
                          ? 'bg-gold border-gold text-black' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <footer className="p-8 border-t border-white/5">
              <button 
                onClick={handleSubmit}
                className="w-full py-5 btn-gold rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Publicar Evento
              </button>
            </footer>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
