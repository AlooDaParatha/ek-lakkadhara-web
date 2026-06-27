'use client';

import React from 'react';

export default function Footer() {
  const handleEasterEgg = () => {
    // Hidden morse code trigger trigger or mysterious sound!
    if (typeof window !== 'undefined' && window.playProceduralJumpscare) {
      // Play a quick spooky sound
      window.playProceduralWhisper();
      // Manual trigger glitch glitch
      if (window.triggerManualScare) {
        window.triggerManualScare('glitch');
      }
    }
  };

  return (
    <footer className="relative w-full bg-[#050505] pt-24 pb-12 px-6 md:px-16 flex flex-col items-center overflow-hidden border-t border-slate-950">
      
      {/* Misty bottom light glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-44 bg-[#2c3539]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full z-20 flex flex-col items-center">
        
        {/* Animated Flickering Lantern SVG */}
        <div 
          onClick={handleEasterEgg}
          className="relative w-16 h-28 cursor-pointer select-none mb-12 group"
          title="Investigate the lantern..."
        >
          {/* Light Glow Halo */}
          <div className="absolute top-[35px] left-[16px] w-8 h-8 rounded-full bg-amber-500/30 blur-md group-hover:bg-red-500/30 transition-colors duration-500 flicker-slow pointer-events-none" />
          <div className="absolute top-[30px] left-[11px] w-14 h-14 rounded-full bg-amber-600/10 blur-xl group-hover:bg-red-600/10 transition-colors duration-500 flicker-fast pointer-events-none" />

          {/* Detailed Lantern Outline */}
          <svg viewBox="0 0 100 160" className="w-full h-full text-slate-800 group-hover:text-red-950 transition-colors duration-500">
            {/* Top Loop */}
            <circle cx="50" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="5" />
            {/* Cap */}
            <path d="M25 45 L75 45 L65 32 L35 32 Z" fill="currentColor" />
            {/* Frame Bars */}
            <line x1="28" y1="45" x2="28" y2="120" stroke="currentColor" strokeWidth="5" />
            <line x1="72" y1="45" x2="72" y2="120" stroke="currentColor" strokeWidth="5" />
            <line x1="50" y1="45" x2="50" y2="120" stroke="currentColor" strokeWidth="3" />
            {/* Glass body */}
            <path d="M30 45 L70 45 L65 120 L35 120 Z" fill="rgba(245, 158, 11, 0.1)" stroke="currentColor" strokeWidth="2" className="flicker-slow" />
            {/* Flame Inside glass */}
            <path 
              d="M50 70 Q58 95 50 110 Q42 95 50 70 Z" 
              fill="#f59e0b" 
              className="flicker-fast shadow-[0_0_15px_#f59e0b] group-hover:fill-[#ef4444]" 
            />
            {/* Bottom Fuel Base */}
            <rect x="20" y="120" width="60" height="20" rx="3" fill="currentColor" />
          </svg>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-xs font-mono tracking-widest text-slate-500 uppercase">
          <a href="#about" className="hover:text-[#d2e4f0] transition-colors">BACKSTORY</a>
          <a href="#features" className="hover:text-[#d2e4f0] transition-colors">RULES</a>
          <a href="#screenshots" className="hover:text-[#d2e4f0] transition-colors">REGIONS</a>
          <a href="#characters" className="hover:text-[#d2e4f0] transition-colors">PROFILES</a>
          <a 
            onClick={handleEasterEgg}
            className="hover:text-red-500 cursor-pointer transition-colors"
          >
            [ LOGOUT FEED ]
          </a>
        </div>

        {/* Social Icons with Red Glow Hover */}
        <div className="flex gap-6 mb-12">
          
          {/* Steam */}
          <a
            href="https://store.steampowered.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-slate-900 bg-[#0c0d0f] hover:border-blue-500 hover:text-blue-500 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
            title="Wishlist on Steam"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 .002C5.378.002.002 5.377.002 12c0 5.485 3.68 10.11 8.749 11.583l-1.63-2.224a3.842 3.842 0 0 1-1.127-2.613c0-1.848 1.306-3.4 3.064-3.774l1.39-2.025a3.843 3.843 0 0 1 3.553-5.263 3.847 3.847 0 1 1 0 7.693 3.842 3.842 0 0 1-2.083-.61l-2.004 1.408c.038.257.058.52.058.788 0 2.126-1.724 3.85-3.85 3.85-.353 0-.693-.048-1.02-.138l2.06 2.82C20.612 22.373 24 17.583 24 12c0-6.623-5.378-11.998-11.998-11.998" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-slate-900 bg-[#0c0d0f] hover:border-red-600 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
            title="Watch Development Vlogs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-slate-900 bg-[#0c0d0f] hover:border-indigo-500 hover:text-indigo-400 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
            title="Join Cursed Community Discord"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
            </svg>
          </a>

        </div>

        {/* Legal copyrights */}
        <div className="text-center text-[10px] font-mono text-slate-600 tracking-wider">
          <p>© 2026 EK LAKKADHARA. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 text-slate-800">
            ENGINE BUILT BY SENIOR FRONTEND TEAM • CLASS-A HORROR SPECIFICATION
          </p>
        </div>

      </div>

    </footer>
  );
}
