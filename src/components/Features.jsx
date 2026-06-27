'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Key, Flame, Skull } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, rune }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Transform into -0.5 to 0.5 range
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    // Calculate rotation angles (tilt up to 12 degrees)
    setRotateX(-yPct * 20);
    setRotateY(xPct * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
      }}
      className="wood-board w-full p-8 rounded-lg relative overflow-hidden flex flex-col justify-between h-[360px] cursor-pointer group select-none interactive-card"
    >
      
      {/* Runes background glow overlay */}
      <div 
        className="absolute inset-0 bg-radial-[circle_at_center] from-[#8a0303]/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
      />

      {/* Rune carving at background */}
      <div className="absolute right-4 bottom-4 text-7xl font-bold font-mono text-[#1c1211] group-hover:text-[#8a0303]/20 transition-colors duration-500 select-none select-none pointer-events-none">
        {rune}
      </div>

      <div>
        {/* Carved Icon Container */}
        <div className="w-12 h-12 rounded bg-black/40 border border-[#2b1f1d] flex items-center justify-center text-gray-400 group-hover:text-red-600 group-hover:border-red-950 transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>

        {/* Feature Title */}
        <h3 className="text-xl font-horror-serif tracking-widest text-[#d2e4f0] mt-6 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Feature Description */}
        <p className="text-sm text-gray-500 mt-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Footer runes status */}
      <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-stone-600 group-hover:text-[#8a0303] transition-colors duration-500">
        <span>STATUS: ACTIVE</span>
        <span className="rune-glow tracking-widest">{isHovered ? '✦ CURSED ✦' : '✦ DORMANT ✦'}</span>
      </div>

      {/* Carved lines borders overlay */}
      <div className="absolute inset-0 border border-[#8a0303]/0 group-hover:border-[#8a0303]/30 rounded-lg pointer-events-none transition-colors duration-500" />
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: EyeOff,
      title: 'Stealth & Evade',
      description: 'The forest is thick and dense. Hide in closets, foliage, and old wooden cabinets. Keep your flashlight off when you hear the heavy footsteps approaching.',
      rune: '᚛',
    },
    {
      icon: Key,
      title: 'Cryptic Puzzles',
      description: 'Piece together rusted machinery, decode old cabin lock boxes, and discover forgotten pathways using journals left by lost researchers.',
      rune: '᚜',
    },
    {
      icon: Flame,
      title: 'Lantern Kerosene',
      description: 'Darkness accelerates your panic. Ration your matchsticks and lantern oil carefully. The shadows hide entities that feed on your fear.',
      rune: 'ᚌ',
    },
    {
      icon: Skull,
      title: 'Adaptive Enemy AI',
      description: 'The Lumberjack is not on a fixed path. He responds to noise, investigates lights, checks hiding spots, and gets smarter the closer you get to escape.',
      rune: 'ᚎ',
    },
  ];

  return (
    <section 
      id="features" 
      className="relative w-full bg-[#0d0f12] py-24 px-6 md:px-16 flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-6xl w-full z-20">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a0303] font-mono font-bold">GAME MECHANICS</span>
          <h2 className="text-3xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mt-3">
            SURVIVAL RULES
          </h2>
          <div className="w-16 h-[2px] bg-[#8a0303] mx-auto mt-4" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <FeatureCard key={idx} {...f} />
          ))}
        </div>

      </div>

      {/* Decorative background grid line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" />
    </section>
  );
}
