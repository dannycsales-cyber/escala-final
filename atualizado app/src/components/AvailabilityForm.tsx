import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, Save, Info } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { Volunteer, Ministry } from '../types';

interface AvailabilityFormProps {
  currentVolunteer: Volunteer;
  onSave: (volunteerId: string, dates: string[], activeMinistries: Ministry[]) => void;
}

export default function AvailabilityForm({ currentVolunteer, onSave }: AvailabilityFormProps) {
  const [selectedDates, setSelectedDates] = React.useState<string[]>(currentVolunteer.availableDates);
  const [selectedMinistries, setSelectedMinistries] = React.useState<Ministry[]>(currentVolunteer.ministries);
  const [isSaved, setIsSaved] = React.useState(false);

  const daysOfMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  const toggleDate = (date: string) => {
    setIsSaved(false);
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const toggleMinistry = (min: Ministry) => {
    setIsSaved(false);
    setSelectedMinistries(prev => 
      prev.includes(min) ? prev.filter(m => m !== min) : [...prev, min]
    );
  };

  const handleSave = () => {
    onSave(currentVolunteer.id, selectedDates, selectedMinistries);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const ministriesList: Ministry[] = ['CAPITÃO', 'APOIO TEMPLO', 'RECEPÇÃO', 'ESTACIONAMENTO', 'COZINHA', 'KIDS', 'MÍDIA', 'DANÇA'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2 sm:px-0">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold gold-text">Sua Disponibilidade</h2>
        <p className="text-white/80 text-xs sm:text-sm font-medium">Siga os passos abaixo para garantir sua participação.</p>
      </div>

      {/* Steps Progress Visualizer */}
      <div className="grid grid-cols-3 gap-2 px-2">
        {[
          { label: 'Ministérios', active: selectedMinistries.length > 0 },
          { label: 'Datas', active: selectedDates.length > 0 },
          { label: 'Escala', active: false },
        ].map((step, i) => (
          <div key={i} className="space-y-2">
            <div className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              step.active ? "bg-gold shadow-[0_0_8px_#D4AF37]" : "bg-white/20"
            )} />
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-black block text-center mt-1",
              step.active ? "text-gold" : "text-white/50"
            )}>Passo {i + 1}: {step.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Select Ministries */}
        <div className="space-y-6">
          <div className="bg-gray-dark/50 p-6 rounded-2xl border border-gray-med/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-xs font-black shadow-[0_0_15px_#D4AF37]">1</div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-xs">Confirmar Ministérios</h3>
                <p className="text-[11px] text-gold/80 italic font-medium">Selecione onde você deseja servir</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {ministriesList.map(min => (
                <button
                  key={min}
                  onClick={() => toggleMinistry(min)}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group shadow-sm",
                    selectedMinistries.includes(min) 
                      ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02]" 
                      : "bg-white/5 border-white/10 text-white hover:border-gold/50"
                  )}
                >
                  <span className="font-black text-[11px] uppercase tracking-[0.2em]">{min}</span>
                  {selectedMinistries.includes(min) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Select Dates */}
        <div className="space-y-6">
          <div className="bg-gray-dark/50 p-6 rounded-2xl border border-gray-med/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-xs font-black shadow-[0_0_15px_#D4AF37]">2</div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-xs">Datas Disponíveis</h3>
                <p className="text-[11px] text-gold/80 italic font-medium">Selecione os dias que você pode servir</p>
              </div>
            </div>

            <div className="bg-black/80 rounded-xl p-4 border border-white/10 shadow-xl">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="text-center text-[11px] font-black text-white/50 py-2">{d}</div>
                ))}
                {daysOfMonth.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isSelected = selectedDates.includes(dateStr);
                  const isEventDay = day.getDay() === 0 || day.getDay() === 3;

                  return (
                    <button
                      key={i}
                      onClick={() => toggleDate(dateStr)}
                      className={cn(
                        "aspect-square rounded-lg text-xs font-bold transition-all border flex items-center justify-center relative",
                        isSelected 
                          ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(212,175,55,0.6)] z-10 scale-105" 
                          : isEventDay 
                            ? "bg-gold-dim/20 border-gold/40 text-gold hover:border-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]" 
                            : "bg-black/40 border-white/10 text-white/40 hover:border-white/30"
                      )}
                    >
                      {format(day, 'd')}
                      {isEventDay && !isSelected && (
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_5px_#D4AF37]" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gold shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
                  <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm border border-gold/40 bg-gold-dim/20" />
                  <span className="text-gold/80">Dias de Culto</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleSave}
              disabled={selectedDates.length === 0 || selectedMinistries.length === 0}
              className={cn(
                "w-full py-5 rounded-xl text-xs uppercase tracking-[0.2em] font-black transition-all flex items-center justify-center gap-3 overflow-hidden relative",
                isSaved 
                  ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                  : "btn-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-[1.01] active:scale-95 disabled:opacity-30 disabled:grayscale"
              )}
            >
              {isSaved ? (
                <>
                  <Check className="w-5 h-5 animate-bounce" />
                  Sua Disponibilidade foi Salva!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Confirmar Disponibilidade
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-white/20">
              <Info className="w-3 h-3 text-gold/40" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Clique no culto para visualizar detalhes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
