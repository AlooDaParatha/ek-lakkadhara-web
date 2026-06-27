'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, Compass } from 'lucide-react';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleManualScare = () => {
    if (typeof window !== 'undefined' && window.triggerManualScare) {
      window.triggerManualScare('glitch');
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#050505] select-none">
      
      {/* LAYER 1: Deep Sky & Moon Glow (Moves opposite to cursor) */}
      <div 
        className="absolute inset-0 z-0 bg-radial-[circle_at_center_top] from-[#0f172a] via-[#050505] to-[#050505] transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px) scale(1.05)`,
        }}
      >
        {/* Glowing Full Moon */}
        <div 
          className="absolute top-[18%] left-[55%] w-36 h-36 rounded-full bg-[#d2e4f0] opacity-25 blur-md"
          style={{
            boxShadow: '0 0 100px 30px rgba(210, 228, 240, 0.3)',
          }}
        />
      </div>

      {/* LAYER 2: Cursed Cabin & Forest Background (Our generated cabin asset) */}
      <div 
        className="absolute inset-0 z-10 transition-transform duration-300 ease-out bg-cover bg-center bg-no-repeat filter opacity-65 grayscale-[30%]"
        style={{
          backgroundImage: "url('/cabin.png')",
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px) scale(1.08)`,
        }}
      />

      {/* LAYER 3: Dark Foreground Tree Silhouettes (Creepy vector pines in front of the cabin) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-2/3 z-20 pointer-events-none transition-transform duration-300 ease-out opacity-85 flex justify-between items-end px-2"
        style={{
          transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -25}px) scale(1.12)`,
        }}
      >
        {/* Left Pines SVG */}
        <svg className="w-1/3 h-full max-h-[550px] text-[#050505]" viewBox="0 0 300 600" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,200 150,350 120,350 170,480 140,480 200,600 0,600 0,200" />
          <polygon points="210,300 240,420 225,420 260,520 240,520 280,600 100,600 100,300" />
        </svg>
        {/* Right Pines SVG */}
        <svg className="w-1/3 h-full max-h-[550px] text-[#050505]" viewBox="0 0 300 600" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <polygon points="200,180 150,330 180,330 130,460 160,460 100,600 300,600 300,180" />
          <polygon points="90,280 60,400 75,400 40,500 60,500 20,600 200,600 200,280" />
        </svg>
      </div>

      {/* LAYER 4: Low-lying Fog drifting across bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-30 pointer-events-none" />

      {/* Hero Content Area */}
      <div className="relative z-40 text-center px-4 flex flex-col items-center max-w-4xl">
        {/* Game Title with Glitch Effect */}
        <h1 
          onClick={handleManualScare}
          data-text="EK LAKKADHARA"
          className="text-6xl md:text-9xl font-horror-serif font-bold tracking-widest text-[#d2e4f0] uppercase cursor-pointer glitch-text chromatic-aberration select-none moon-glow"
        >
          EK LAKKADHARA
        </h1>

        {/* Flickering Subtitle */}
        <p className="mt-6 text-sm md:text-lg font-mono tracking-widest text-red-700 font-semibold flicker-slow uppercase">
          — DEEP IN THE WOODS, HE IS WAITING FOR YOU —
        </p>

        {/* CTA Buttons with wooden board gradients */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-lg">
          
          {/* 1. Enter The Forest (Scroll to lore) */}
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border-2 border-slate-700 bg-linear-to-b from-stone-900 to-black hover:border-slate-300 text-[#d2e4f0] transition-all duration-300 tracking-widest font-horror-serif text-sm cursor-pointer shadow-lg active:scale-95"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            ENTER THE FOREST
          </button>

          {/* 2. Watch Trailer (Scroll to video player) */}
          <button
            onClick={() => scrollToSection('trailer')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border-2 border-red-950 bg-linear-to-b from-[#1c0404] to-[#070101] hover:border-red-600 text-[#d2e4f0] hover:shadow-[0_0_15px_rgba(138,3,3,0.4)] transition-all duration-300 tracking-widest font-horror-serif text-sm cursor-pointer shadow-lg active:scale-95"
          >
            <Play className="w-4 h-4 text-red-600" />
            WATCH TRAILER
          </button>

          {/* 3. Steam Wishlist CTA */}
          <a
            href="https://store.steampowered.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border-2 border-blue-950 bg-gradient-to-b from-[#0f1c2e] to-[#050b14] hover:border-blue-500 text-[#d2e4f0] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 tracking-widest font-horror-serif text-sm cursor-pointer shadow-lg active:scale-95"
          >
            <Flame className="w-4 h-4 text-blue-500" />
            WISHLIST NOW
          </a>

        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => scrollToSection('about')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-[#d2e4f0] transition-colors"
        >
          <span className="text-[10px] tracking-widest font-mono uppercase">SCROLL TO INVESTIGATE</span>
          <motion.div
            className="w-1.5 h-6 bg-slate-700 rounded-full"
            animate={{
              y: [0, 6, 0],
              backgroundColor: ['#475569', '#d2e4f0', '#475569']
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut'
            }}
          />
        </div>

      </div>

    </section>
  );
}
