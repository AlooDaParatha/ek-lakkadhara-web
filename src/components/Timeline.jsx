'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Calendar, Skull, ShieldAlert, Sparkles, Hash } from 'lucide-react';

export default function Timeline() {
  const [activeLog, setActiveLog] = useState(null);

  const history = [
    {
      year: '1934',
      title: 'Settling The Valley',
      summary: 'A quiet, skilled woodcutter arrives in the mountain valley. He builds a small cabin, seeking peace after a tragic loss.',
      detail: 'Local records indicate his name was Elias. He bartered timber with the village. Described as friendly but deeply sorrowful, he lived alone with his daughter.',
      icon: Calendar,
    },
    {
      year: '1949',
      title: 'The Mill Betrayal',
      summary: 'A local timber baron demands Elias hand over his land rights. Elias refuses. Mysteriously, his daughter vanishes, and his cabin is burned down.',
      detail: 'No body was recovered. The sheriff ruled it an accidental fire, but villagers suspected the timber corporation. Elias withdrew entirely into the deep forest.',
      icon: ShieldAlert,
    },
    {
      year: '1950',
      title: 'First Sighting',
      summary: 'Elias disappears. Weeks later, corporate loggers are found slaughtered near the abandoned cabin ruins. Witnesses report a tall lumberjack holding a black axe.',
      detail: 'The logging site was shut down immediately. Sheriff report lists "undetermined wild animal attacks", but loggers claimed trees seemed to move, blocking their escapes.',
      icon: Skull,
    },
    {
      year: '1964',
      title: 'The Creeping Fog',
      summary: 'Heavy, static-filled fog rolls into the valley, sealing off the mountains. Electronic compasses spin out of control.',
      detail: 'The mist causes mild hallucinations and headaches. A watchtower is built to monitor forest fires, but rangers report hearing rhythmic axe chops through radio channels.',
      icon: HelpCircle,
    },
    {
      year: '1978',
      title: 'Village Evacuation',
      summary: 'A string of hiker disappearances forces the government to evacuate remaining cabins. The forest is designated a restricted dead zone.',
      detail: 'Military scouts sent to map the coordinates failed to return. Only one shattered compass and a notebook detailing "the lumberjack eyes in the dark" were found.',
      icon: Hash,
    },
    {
      year: 'PRESENT',
      title: 'The Investigation',
      summary: 'You cross the locked heavy metal gate, searching for a group of missing students. You are trapped.',
      detail: 'You must search the main cabin, gather missing keys, repair the sawmill generator, and evade Elias. The forest is alive, and he knows you are here.',
      icon: Sparkles,
    },
  ];

  const handleLogClick = (idx) => {
    setActiveLog(activeLog === idx ? null : idx);
    // Play a spooky whisper sound
    if (typeof window !== 'undefined' && window.playProceduralWhisper) {
      window.playProceduralWhisper();
    }
  };

  return (
    <section 
      id="timeline" 
      className="relative w-full bg-[#050505] py-24 px-6 md:px-16 flex flex-col items-center overflow-hidden"
    >
      
      {/* Background glow */}
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-red-950/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full z-20">
        
        {/* Timeline Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8a0303] font-mono font-bold">HISTORICAL LOGS</span>
          <h2 className="text-3xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mt-3">
            CHRONOLOGY OF A CURSE
          </h2>
          <div className="w-16 h-[2px] bg-[#8a0303] mx-auto mt-4" />
        </div>

        {/* Timeline Core */}
        <div className="relative border-l-2 border-[#1e2226] ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {history.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = activeLog === idx;

            return (
              <div key={idx} className="relative group">
                
                {/* Year Badge on the Left (Hidden on mobile) */}
                <div className="absolute right-full mr-12 top-0 hidden md:block text-right">
                  <span className="text-2xl font-horror-serif tracking-wider font-bold text-slate-500 group-hover:text-red-600 group-hover:chromatic-aberration transition-colors duration-300">
                    {item.year}
                  </span>
                </div>

                {/* Timeline node node */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-[#050505] border-2 border-slate-700 group-hover:border-red-600 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-red-600 transition-colors" />
                </div>

                {/* Log Content Card */}
                <div 
                  onClick={() => handleLogClick(idx)}
                  className="bg-[#0c0d0f] border border-slate-900 hover:border-slate-800 p-6 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden interactive-card"
                >
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-transparent group-hover:bg-red-700 transition-colors" />

                  {/* Header Title with Mobile Year */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-horror-serif tracking-widest text-[#d2e4f0] flex items-center gap-3">
                      <span className="md:hidden text-red-600 font-mono text-sm mr-1">[{item.year}]</span>
                      {item.title}
                    </h3>
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-colors" />
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Expandable detailed content */}
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-slate-900 text-xs font-mono text-slate-500 leading-relaxed space-y-2 select-text"
                    >
                      <div className="text-red-800 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-800" />
                        Classified Intelligence // Archive Log
                      </div>
                      <p className="italic text-slate-400">
                        {item.detail}
                      </p>
                    </motion.div>
                  )}

                  {/* Decayed corner details */}
                  <span className="absolute bottom-2 right-4 text-[8px] font-mono text-slate-800">
                    LOG_ID_{idx * 13 + 104}
                  </span>

                </div>
              </div>
            );
          })}
        </div>

      </div>
      
      {/* Decorative separating line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-30" />
    </section>
  );
}
