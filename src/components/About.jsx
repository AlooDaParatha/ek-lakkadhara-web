'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Feather } from 'lucide-react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <section 
      id="about" 
      className="relative min-h-screen w-full bg-linear-to-b from-[#050505] to-[#0d0f12] py-24 px-6 md:px-16 flex flex-col justify-center items-center overflow-hidden"
    >
      
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2c3539]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-20"
      >
        
        {/* Left Column: Story Description */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div variants={itemVariants} className="flex items-center gap-3 text-red-600 mb-4">
            <Feather className="w-5 h-5 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] font-mono font-bold">THE INVESTIGATION LOG</span>
          </motion.div>

          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-horror-serif tracking-widest text-[#d2e4f0] mb-8"
          >
            A Tragic Legend. <br />A Cursed Territory.
          </motion.h2>

          <motion.div variants={itemVariants} className="space-y-6 text-gray-400 font-sans text-base leading-relaxed">
            <p>
              Decades ago, a humble woodcutter lived peacefully deep inside these mountains. But betrayal and a silent tragedy warped his mind, dragging him into the dark embrace of the woods. He vanished, leaving behind only whispering rumors of a tall, axe-wielding specter.
            </p>
            <p>
              Villagers call him <strong className="text-red-600">"The Lumberjack" (Ek Lakkadhara)</strong>. His vengeful presence has corrupted the entire valley, twisting the trees, blackening the fog, and trapping anyone foolish enough to cross his territory.
            </p>
            <p className="border-l-2 border-red-800 pl-4 italic text-gray-500">
              "You arrived to search for missing backpackers. But now, the fog has closed in, the roads have vanished, and a heavy wooden gate is locked behind you. Your only hope is to piece together the truth before he catches your scent."
            </p>
          </motion.div>
        </div>

        {/* Right Column: Floating Journal Note Clue */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-5 flex justify-center items-center"
        >
          {/* Spring Floating Old Journal Page */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0.5, -0.5, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            className="journal-note w-full max-w-sm p-8 pb-12 aspect-[3/4] flex flex-col justify-between text-stone-900 border border-amber-950/20 select-none relative interactive-card"
          >
            {/* Blood Spills / Coffee rings details */}
            <div className="absolute top-4 right-6 opacity-30 select-none pointer-events-none">
              <FileText className="w-8 h-8 text-amber-900" />
            </div>

            <div>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#8a0303] mb-6 font-bold">
                CLUE #17 — DIARY SCRAP
              </span>
              
              <h3 className="text-xs uppercase font-mono font-bold text-stone-800 mb-4 border-b border-stone-800/20 pb-2">
                October 24th, 1982
              </h3>
              
              <p className="text-sm font-horror-journal leading-relaxed text-stone-850">
                "The engine of the old sawmill stopped running last night, but I could still hear the saws screaming.
                I saw a shadow walking with a massive axe by the cabin gate.
                My daughter says he whispered her name from the well.
                We cannot leave. The fog has swallowed the mountains. 
                If you find this note... do not look for us."
              </p>
            </div>

            <div className="mt-8 border-t border-stone-800/10 pt-4 flex justify-between items-center text-[10px] font-mono text-stone-700">
              <span>FOUND NEAR WATER TOWER</span>
              <span className="text-[#8a0303] font-bold">STAINED IN RUST</span>
            </div>
            
            {/* Old Blood Splatter Effect */}
            <div className="absolute bottom-6 right-8 w-12 h-12 rounded-full bg-[#8a0303]/25 blur-xs filter mix-blend-multiply pointer-events-none" />
          </motion.div>
        </motion.div>

      </motion.div>

    </section>
  );
}
