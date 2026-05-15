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
            <div className="flex flex-col items-center gap-16 mt-8">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "1em", y: 20 }}
                animate={{ opacity: 1, letterSpacing: "1.2em", y: 0 }}
                transition={{ delay: 1, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-4xl md:text-7xl text-white font-serif font-light uppercase tracking-[0.4em] sm:tracking-[0.6em] ml-[0.4em] sm:ml-[0.6em] drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                  ESCALA <span className="text-gold italic font-bold">CJPP</span>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                className="flex flex-col items-center gap-12"
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                  <div className="flex items-center gap-4 sm:gap-8 text-[9px] sm:text-xs md:text-sm text-white/90 font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                     <motion.span 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 2.2, duration: 1 }}
                       className="drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                     >
                       PROPÓSITO
                     </motion.span>
                     <span className="text-gold opacity-30">◆</span>
                     <motion.span 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 2.5, duration: 1 }}
                       className="drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                     >
                       EXCELÊNCIA
                     </motion.span>
                     <span className="text-gold opacity-30">◆</span>
                     <motion.span 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 2.8, duration: 1 }}
                       className="drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                     >
                       REINO
                     </motion.span>
                  </div>
                  <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 3.2, duration: 1.5 }}
                  className="text-[10px] uppercase tracking-[0.8em] font-medium text-white ml-[0.8em]"
                >
                  Servindo ao Reino com Excelência
                </motion.p>
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
