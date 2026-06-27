'use client';

import React, { useState } from 'react';
import CustomCursor from '@/components/CustomCursor';
import AudioPlayer from '@/components/AudioPlayer';
import FogCanvas from '@/components/FogCanvas';
import JumpscareManager from '@/components/JumpscareManager';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import Screenshots from '@/components/Screenshots';
import Trailer from '@/components/Trailer';
import Timeline from '@/components/Timeline';
import Characters from '@/components/Characters';
import Footer from '@/components/Footer';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (jumpscaresEnabled) => {
    if (typeof window !== 'undefined') {
      window.__jumpscaresEnabled = jumpscaresEnabled;
    }
    setGameStarted(true);
  };

  return (
    <>
      {/* Film Grain Cinematic Overlay (Persistent) */}
      <div className="film-grain" />

      {/* Custom Glowing Cursor */}
      <CustomCursor />

      {/* Atmospheric Audio Controller & Warning Gate */}
      <AudioPlayer onStartGame={handleStartGame} />

      {/* Jumpscare Scheduler */}
      <JumpscareManager />

      {/* Ambient Forest Fog Particles (Fades in after starting) */}
      {gameStarted && <FogCanvas />}

      {/* Main Page Layout */}
      {gameStarted && (
        <div className="flex flex-col min-h-screen relative z-10">
          <main className="flex-grow flex flex-col">
            <Hero />
            <About />
            <Features />
            <Screenshots />
            <Trailer />
            <Timeline />
            <Characters />
            <Footer />
          </main>
        </div>
      )}
    </>
  );
}
