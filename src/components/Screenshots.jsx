'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, MapPin } from 'lucide-react';

export default function Screenshots() {
  const [activeImage, setActiveImage] = useState(null);

  const images = [
    {
      src: '/cabin.png',
      title: 'The Main Cabin',
      area: 'Sector Alpha — Woods entrance. Decayed wooden boards. Inside lies a key to the sawmill.',
      coordinates: '42.38° N, 71.12° W',
    },
    {
      src: '/mill.png',
      title: 'Abandoned Lumber Mill',
      area: 'Sector Beta — Central processing. Rusted blades, ancient generators. A deep growl resonates below.',
      coordinates: '42.39° N, 71.15° W',
    },
    {
      src: '/shrine.png',
      title: 'The Cursed Shrine',
      area: 'Sector Gamma — Ritual site. Ancient runes glowing crimson. The epicenter of the woodcutter curse.',
      coordinates: '42.41° N, 71.11° W',
    },
    {
      src: '/watchtower.png',
      title: 'Watchtower Outpost',
      area: 'Sector Delta — High vantage. Broken glass, wind howling. Power line terminal sits at the peak.',
      coordinates: '42.36° N, 71.18° W',
    },
  ];

  return (
    <section 
      id="screenshots" 
      className="relative w-full bg-[#0d0f12] py-24 px-6 md:px-16 flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-6xl w-full z-20">
        
        {/* Gallery Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a0303] font-mono font-bold">DEVELOPMENT SNAPSHOTS</span>
          <h2 className="text-3xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mt-3">
            CURSED REGIONS
          </h2>
          <div className="w-16 h-[2px] bg-[#8a0303] mx-auto mt-4" />
        </div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              layoutId={`screenshot-container-${idx}`}
              onClick={() => setActiveImage({ ...img, index: idx })}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-lg bg-black border border-slate-900 group aspect-[16/10] cursor-pointer shadow-xl interactive-card"
            >
              {/* Screenshot Image */}
              <motion.img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover filter brightness-[75%] contrast-[110%] group-hover:scale-105 group-hover:brightness-[90%] transition-all duration-700"
              />

              {/* Fog overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

              {/* Hover indicator (Zoom Icon) */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 border border-slate-800 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <ZoomIn className="w-5 h-5" />
              </div>

              {/* Caption details */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end pointer-events-none">
                <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] tracking-widest uppercase">
                  <MapPin className="w-3 h-3" />
                  {img.coordinates}
                </div>
                <h3 className="text-xl font-horror-serif tracking-widest text-slate-100 mt-2">
                  {img.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {img.area}
                </p>
              </div>

              {/* Framing vignette */}
              <div className="absolute inset-0 border border-slate-900/50 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeImage !== null && (
          <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/95 p-4 md:p-8">
            
            {/* Custom dark vignette overlay */}
            <div className="vignette-overlay z-0" />

            {/* Back Close Backdrop */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              onClick={() => setActiveImage(null)} 
            />

            {/* Modal Body Container */}
            <motion.div
              layoutId={`screenshot-container-${activeImage.index}`}
              className="relative z-20 w-full max-w-5xl max-h-[85vh] rounded-lg overflow-hidden bg-black border border-slate-800 flex flex-col justify-between"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-55 w-10 h-10 rounded-full bg-black/60 border border-slate-700 hover:border-red-600 hover:text-red-500 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image */}
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="w-full object-contain bg-black select-none"
              />

              {/* Description Panel */}
              <div className="bg-[#0c0d0f] border-t border-slate-900 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-red-500 font-mono text-xs tracking-widest uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeImage.coordinates}
                  </div>
                  <h3 className="text-2xl font-horror-serif tracking-widest text-slate-100 mt-2">
                    {activeImage.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                    {activeImage.area}
                  </p>
                </div>

                <button
                  onClick={() => setActiveImage(null)}
                  className="px-6 py-2.5 bg-transparent border border-slate-700 text-slate-300 hover:border-[#8a0303] hover:text-[#d2e4f0] transition-colors font-mono text-xs tracking-widest cursor-pointer"
                >
                  DISMISS LOG
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Decorative separating line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" />
    </section>
  );
}
