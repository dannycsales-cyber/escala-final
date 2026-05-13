import React from 'react';

// A imagem deve ser salva pelo usuário em src/ativos/cjpp-logo.png
// Usamos um path relativo para garantir que carregue mesmo que o alias @ falhe em alguns contextos de build
import logoCJPP from '../ativos/cjpp-logo.png';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export default function OfficialLogo({ className = "w-full h-full", glow = true }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-gold/20 w-[140%] h-[140%] rounded-full blur-[40px] animate-pulse -z-10 m-auto opacity-40 shadow-[0_0_50px_rgba(212,175,55,0.2)]" />
      )}
      
      <img 
        src={logoCJPP} 
        alt="CJPP Oficial" 
        className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-700 hover:scale-105" 
        style={{ filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))' }}
        onError={(e) => {
          // Fallback if image is missing or invalid
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent && !parent.querySelector('.logo-text-fallback')) {
             const fallback = document.createElement('div');
             fallback.className = 'logo-text-fallback text-gold font-serif text-5xl font-light tracking-tighter drop-shadow-lg';
             fallback.innerText = 'CJPP';
             parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
}
