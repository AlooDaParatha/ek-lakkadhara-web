'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, Minimize2, X, Sparkles } from 'lucide-react';

export default function Trailer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTheater, setIsTheater] = useState(false);

  // Creepy atmospheric horror game stock teaser
  const trailerUrl = "https://www.youtube.com/embed/PyM3S7I-1Jc?autoplay=1&mute=0&rel=0";

  return (
    <section 
      id="trailer" 
      className="relative w-full bg-linear-to-b from-[#0d0f12] to-[#050505] py-24 px-6 md:px-16 flex flex-col items-center overflow-hidden"
    >
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl w-full z-20 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a0303] font-mono font-bold">CINEMATIC TEASER</span>
          <h2 className="text-3xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mt-3">
            WATCH THE LORE
          </h2>
          <div className="w-16 h-[2px] bg-[#8a0303] mx-auto mt-4" />
        </div>

        {/* Custom Video Player Frame */}
        <div className="relative w-full aspect-[16/9] bg-black rounded-lg border border-slate-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          <AnimatePresence>
            {!isPlaying ? (
              // Teaser Cover Image Overlay
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-30 flex flex-col justify-center items-center bg-cover bg-center select-none"
                style={{ backgroundImage: "url('/mill.png')" }}
              >
                {/* Dark fog mask */}
                <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#050505]/70 to-[#050505]" />

                {/* Big Themed Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full border-2 border-red-900 bg-black/40 hover:bg-[#8a0303]/10 hover:border-red-500 hover:shadow-[0_0_30px_rgba(138,3,3,0.7)] flex items-center justify-center text-[#d2e4f0] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-40 group"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                
                <span className="mt-4 font-horror-serif text-sm tracking-widest text-slate-400 group-hover:text-slate-100 transition-colors uppercase select-none pointer-events-none">
                  INITIATE TEASER FEED
                </span>

              </motion.div>
            ) : (
              // Embedded Video Player
              <div className="absolute inset-0 z-10 w-full h-full">
                <iframe
                  src={trailerUrl}
                  title="Ek Lakkadhara Teaser Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
          </AnimatePresence>

          {/* Player controls ribbon (faked for aesthetics) */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center text-xs font-mono text-gray-500 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-[#8a0303] uppercase tracking-widest font-semibold">FEED-LOG // PLAYING</span>
            </div>
            
            <div className="flex gap-4 pointer-events-auto">
              <button 
                onClick={() => setIsTheater(true)}
                className="hover:text-slate-200 transition-colors cursor-pointer"
                title="Enter Theater Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* THEATER MODE LIGHTBOX */}
      <AnimatePresence>
        {isTheater && (
          <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black">
            
            {/* Dark film grain mask */}
            <div className="vignette-overlay z-10 pointer-events-none" />

            {/* Close Theater Button */}
            <button
              onClick={() => setIsTheater(false)}
              className="absolute top-6 right-6 z-55 flex items-center gap-2 bg-black/60 border border-slate-800 p-2.5 rounded-full px-4 text-xs font-mono tracking-widest text-[#d2e4f0] hover:border-red-600 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>EXIT THEATER</span>
            </button>

            {/* Scaled-up Fullscreen Teaser */}
            <div className="w-full h-full max-w-7xl max-h-[85vh] aspect-[16/9] z-20 border border-slate-900">
              <iframe
                src={trailerUrl}
                title="Ek Lakkadhara Teaser Trailer (Theater)"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            
            {/* Overlay background clicks */}
            <div className="absolute inset-0 z-5 cursor-pointer" onClick={() => setIsTheater(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Decorative separating line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" />
    </section>
  );
}
