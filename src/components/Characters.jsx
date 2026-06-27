'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

function CharacterCard({ name, title, traits, src, isLumberjack, threat }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Divide to get a small offset (up to 15px)
    setCoords({ x: x / 10, y: y / 10 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`w-full max-w-sm rounded-lg overflow-hidden border border-slate-900 bg-[#0c0d0f] aspect-[3/4.5] relative select-none flex flex-col justify-end p-8 cursor-pointer shadow-2xl interactive-card group transition-colors duration-500 ${
        isLumberjack && isHovered ? 'border-red-950 shadow-[0_0_40px_rgba(138,3,3,0.3)]' : 'hover:border-slate-800'
      }`}
    >
      
      {/* 3D Parallax Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {src ? (
          // Character Image (Lumberjack)
          <motion.img
            src={src}
            alt={name}
            style={{
              x: coords.x,
              y: coords.y,
              scale: 1.1,
            }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
            className={`w-full h-full object-cover filter brightness-[50%] contrast-[110%] group-hover:brightness-[70%] transition-all duration-700 ${
              isLumberjack ? 'breath-animation grayscale-[40%] group-hover:grayscale-[0%]' : ''
            }`}
          />
        ) : (
          // Blank Investigator Silhouette Layout (Synthesized vector canvas background)
          <motion.div
            style={{
              x: coords.x,
              y: coords.y,
            }}
            className="w-full h-full bg-radial-[circle_at_center_bottom] from-slate-900/30 via-[#050505] to-[#050505] flex items-center justify-center opacity-70"
          >
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-slate-800 animate-pulse">
              <path d="M50 15 A15 15 0 0 1 50 45 A15 15 0 0 1 50 15 Z M20 85 C20 65 30 55 50 55 C70 55 80 65 80 85 Z" fill="currentColor" />
            </svg>
          </motion.div>
        )}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
        
        {isLumberjack && (
          <div className="absolute inset-0 bg-red-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-color" />
        )}
      </div>

      {/* Card Content (Stretched above image) */}
      <div className="relative z-10 pointer-events-none flex flex-col h-full justify-between">
        
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            ENTITY PROFILE
          </span>
          <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest uppercase border ${
            isLumberjack 
              ? 'border-red-950 bg-red-950/20 text-red-500 group-hover:bg-red-600 group-hover:text-white' 
              : 'border-slate-800 bg-slate-900/20 text-slate-400'
          }`}>
            THREAT: {threat}
          </div>
        </div>

        {/* Bottom Details */}
        <div className="mt-auto">
          
          {/* Tagline */}
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold ${
            isLumberjack ? 'text-red-700' : 'text-slate-400'
          }`}>
            {title}
          </span>
          
          {/* Name */}
          <h3 className="text-3xl font-horror-serif tracking-widest text-[#d2e4f0] mt-1.5 uppercase">
            {name}
          </h3>

          {/* Traits */}
          <div className="mt-4 space-y-2 border-t border-slate-900 pt-4">
            {traits.map((trait, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <div className={`w-1 h-1 rounded-full ${isLumberjack ? 'bg-red-800' : 'bg-slate-500'}`} />
                <span>{trait}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

export default function Characters() {
  const characters = [
    {
      name: 'The Lumberjack',
      title: 'Elias // The Entity',
      threat: 'CRITICAL',
      isLumberjack: true,
      src: '/lumberjack.png',
      traits: [
        'Responds instantly to sound & light source',
        'Can disappear into shadows & reappear behind',
        'Grows highly aggressive as puzzle keys are found',
        'Axe strikes are fatal; cannot be fought directly',
      ],
    },
    {
      name: 'The Investigator',
      title: 'You // The Intruder',
      threat: 'LOW (VICTIM)',
      isLumberjack: false,
      src: null, // Renders silhouette vector
      traits: [
        'Equipped with limited-charge flashlight',
        'Uses old notebook & map to log cabin keys',
        'Movement creates noise (sprint vs crouch)',
        'Must find battery refills to survive darkness',
      ],
    },
  ];

  return (
    <section 
      id="characters" 
      className="relative w-full bg-[#050505] py-24 px-6 md:px-16 flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-4xl w-full z-20">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a0303] font-mono font-bold">GAME CHARACTERS</span>
          <h2 className="text-3xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mt-3">
            THE HUNTED & THE HUNTER
          </h2>
          <div className="w-16 h-[2px] bg-[#8a0303] mx-auto mt-4" />
        </div>

        {/* Cards Row */}
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
          {characters.map((char, idx) => (
            <CharacterCard key={idx} {...char} />
          ))}
        </div>

      </div>
      
      {/* Decorative separating line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" />
    </section>
  );
}
