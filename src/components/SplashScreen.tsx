import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OfficialLogo from './OfficialLogo';

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  const particles = Array.from({ length: 40 });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Cinematic Cinematic Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top-Down Golden Beam - Subtler */}
            <div className="absolute top-0 inset-x-0 h-[60%] bg-gradient-to-b from-gold/15 via-gold/5 to-transparent blur-[120px]" />
            
            {/* Cinematic Floor Flare / Horizon Light - Refined */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[25%] bg-gold/10 rounded-full blur-[100px]" />

            {/* Pulsing Atmosphere - Minimalist */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 rounded-full blur-[200px]"
            />

            {/* Floating Premium Dust Particles - Discrete */}
            {particles.map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%", 
                  opacity: 0,
                  scale: Math.random() * 0.3 + 0.1
                }}
                animate={{ 
                  y: [null, (Math.random() * -30 - 15) + "%"],
                  opacity: [0, 0.3, 0],
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10, 
                  repeat: Infinity, 
                  delay: Math.random() * 10,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center w-full px-8 max-w-4xl">
            {/* CENTRAL LOGO BRANDING - RESTORED PREMIUM PNG LOGO */}
            <div className="relative mb-16 w-full flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }} 
                className="relative z-20 w-[180px] h-[180px]"
              >
                <OfficialLogo className="w-full h-full" glow={true} />
              </motion.div>
            </div>

            {/* TEXT SYSTEM - NOBLE AND SOPHISTICATED */}
            <div className="flex flex-col items-center gap-20 mt-8">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "1.2em", y: 20 }}
                animate={{ opacity: 1, letterSpacing: "1.4em", y: 0 }}
                transition={{ delay: 1.5, duration: 4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-4xl md:text-8xl text-white font-serif font-light uppercase whitespace-nowrap tracking-[0.4em] sm:tracking-[0.8em] ml-[0.4em] sm:ml-[0.8em] drop-shadow-[0_0_40px_rgba(212,175,55,0.7)]">
                  SERVINDO AO <span className="text-gold">REINO</span>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 2 }}
                className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
              >
                <div className="hidden sm:block w-24 h-[1px] bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-[10px] sm:text-sm md:text-lg text-white font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                   <span>PROPÓSITO</span>
                   <span className="text-gold opacity-40">◆</span>
                   <span>EXCELÊNCIA</span>
                   <span className="text-gold opacity-40">◆</span>
                   <span>REINO</span>
                </div>
                <div className="hidden sm:block w-24 h-[1px] bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
              </motion.div>
            </div>
            </div>

          {/* LOADING SYSTEM - POSITIONED NEAR BOTTOM */}
          <div className="absolute bottom-24 flex flex-col items-center gap-8">
             {/* Glowing loading spinner */}
             <div className="relative w-12 h-12">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-[3px] border-white/5 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-[3px] border-transparent border-t-gold rounded-full shadow-[0_0_25px_rgba(212,175,55,0.6)]"
               />
               <div className="absolute inset-0 bg-gold/10 rounded-full blur-[10px]" />
             </div>

             <motion.p 
               animate={{ opacity: [0.2, 0.6, 0.2] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-black text-gold/60 drop-shadow-sm"
             >
               CARREGANDO...
             </motion.p>
          </div>

          {/* Deep Cinematic Overlay / Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
