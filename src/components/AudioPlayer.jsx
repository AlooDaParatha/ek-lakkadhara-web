'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, Skull } from 'lucide-react';

export default function AudioPlayer({ onStartGame }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [jumpscaresEnabled, setJumpscaresEnabled] = useState(true);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef(null);
  const windGainRef = useRef(null);
  const droneGainRef = useRef(null);
  const masterGainRef = useRef(null);
  const afkWhisperRef = useRef(null); // persistent AFK whisper nodes

  // Procedural wind generator (Brown Noise + LFO Filter)
  const startProceduralAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Master Volume Gain
      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Synthesize Brown Noise for Wind
      const bufferSize = 4 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate volume
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Wind filter (Dynamic Bandpass)
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.Q.value = 2.0;
      windFilter.frequency.value = 350;

      // Wind modulation LFO (Slow sweep)
      const windLFO = ctx.createOscillator();
      windLFO.type = 'sine';
      windLFO.frequency.value = 0.07; // Very slow, 0.07Hz

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200; // Modulate frequency by +/- 200Hz

      windLFO.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      
      const windGain = ctx.createGain();
      windGain.gain.value = 0.15; // Set wind volume
      windGainRef.current = windGain;

      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      // Start Wind nodes
      windLFO.start();
      noiseSource.start();

      // 2. Synthesize Sub-Bass Drone Hum (Deep beating oscillators)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 45; // 45Hz sub
      osc2.frequency.value = 45.6; // 45.6Hz (creates beating pulse)

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 80;

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.5; // Strong deep rumble
      droneGainRef.current = droneGain;

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();

      setIsPlaying(true);
    } catch (e) {
      console.error('Failed to create Web Audio context', e);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    startProceduralAudio();
    if (onStartGame) onStartGame(jumpscaresEnabled);
  };

  const togglePlayback = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    } else if (audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = val;
    }
  };

  // Expose triggers in window for the jumpscare manager to call programmatically!
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.playProceduralJumpscare = () => {
      if (!jumpscaresEnabled || !audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const ctx = audioCtxRef.current;
      
      const time = ctx.currentTime;
      
      // Jumpscare High Screech Oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, time);
      osc.frequency.exponentialRampToValueAtTime(1600, time + 0.1);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;

      // Jumpscare Static Noise Burst
      const bufferSize = 0.5 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

      const screechGain = ctx.createGain();
      screechGain.gain.setValueAtTime(0.9, time);
      screechGain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

      osc.connect(filter);
      filter.connect(screechGain);
      screechGain.connect(masterGainRef.current);

      noise.connect(noiseGain);
      noiseGain.connect(masterGainRef.current);

      osc.start(time);
      noise.start(time);

      osc.stop(time + 0.6);
      noise.stop(time + 0.6);
    };

    window.playProceduralWhisper = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const ctx = audioCtxRef.current;
      const time = ctx.currentTime;

      // Low spooky tone swoop
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.linearRampToValueAtTime(60, time + 1.5);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(0.2, time + 0.3);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);

      osc.connect(oscGain);
      oscGain.connect(masterGainRef.current);

      osc.start(time);
      osc.stop(time + 1.6);
    };

    // ── INTENSE SCREAM — layered sawtooth chaos ──
    window.playIntenseScream = () => {
      if (!jumpscaresEnabled || !audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const ctx = audioCtxRef.current;
      const time = ctx.currentTime;

      // Layer 1: ear-splitting high screech
      const screecher = ctx.createOscillator();
      screecher.type = 'sawtooth';
      screecher.frequency.setValueAtTime(80, time);
      screecher.frequency.exponentialRampToValueAtTime(3200, time + 0.06);
      screecher.frequency.exponentialRampToValueAtTime(400, time + 0.25);

      const screechGain = ctx.createGain();
      screechGain.gain.setValueAtTime(1.2, time);
      screechGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      // Layer 2: white noise burst
      const bSize = Math.floor(0.3 * ctx.sampleRate);
      const nBuf = ctx.createBuffer(1, bSize, ctx.sampleRate);
      const nd = nBuf.getChannelData(0);
      for (let i = 0; i < bSize; i++) nd[i] = Math.random() * 2 - 1;
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = nBuf;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(1.4, time);
      nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      // Layer 3: dissonant mid tone
      const mid = ctx.createOscillator();
      mid.type = 'square';
      mid.frequency.setValueAtTime(320, time);
      mid.frequency.linearRampToValueAtTime(180, time + 0.25);
      const midGain = ctx.createGain();
      midGain.gain.setValueAtTime(0.6, time);
      midGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      const dist = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const x = (i * 2) / 256 - 1; curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x)); }
      dist.curve = curve;

      screecher.connect(screechGain);
      screechGain.connect(dist);
      dist.connect(masterGainRef.current);
      nSrc.connect(nGain);
      nGain.connect(masterGainRef.current);
      mid.connect(midGain);
      midGain.connect(masterGainRef.current);

      screecher.start(time); screecher.stop(time + 0.35);
      nSrc.start(time); nSrc.stop(time + 0.35);
      mid.start(time); mid.stop(time + 0.3);
    };

    // ── BASS IMPACT — sub-bass thud that rattles the body ──
    window.playBassImpact = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const ctx = audioCtxRef.current;
      const time = ctx.currentTime;

      const kick = ctx.createOscillator();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(200, time);
      kick.frequency.exponentialRampToValueAtTime(25, time + 0.4);

      const kickGain = ctx.createGain();
      kickGain.gain.setValueAtTime(2.5, time);
      kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      // Add crackle on top
      const cSize = Math.floor(0.08 * ctx.sampleRate);
      const cBuf = ctx.createBuffer(1, cSize, ctx.sampleRate);
      const cd = cBuf.getChannelData(0);
      for (let i = 0; i < cSize; i++) cd[i] = Math.random() * 2 - 1;
      const cSrc = ctx.createBufferSource();
      cSrc.buffer = cBuf;
      const cGain = ctx.createGain();
      cGain.gain.setValueAtTime(0.9, time);
      cGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      kick.connect(kickGain);
      kickGain.connect(masterGainRef.current);
      cSrc.connect(cGain);
      cGain.connect(masterGainRef.current);

      kick.start(time); kick.stop(time + 0.55);
      cSrc.start(time); cSrc.stop(time + 0.1);
    };

    // ── DEEP BREATHING — slow, wet, raspy breathing ──
    window.playDeepBreathing = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const ctx = audioCtxRef.current;
      const time = ctx.currentTime;

      // Brown noise shaped like breath cycles
      const bSize = 4 * ctx.sampleRate;
      const bBuf = ctx.createBuffer(1, bSize, ctx.sampleRate);
      const bd = bBuf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bSize; i++) {
        const w = Math.random() * 2 - 1;
        bd[i] = (last + 0.02 * w) / 1.02;
        last = bd[i];
        bd[i] *= 3.5;
      }
      const bSrc = ctx.createBufferSource();
      bSrc.buffer = bBuf;

      const breathFilter = ctx.createBiquadFilter();
      breathFilter.type = 'bandpass';
      breathFilter.frequency.value = 600;
      breathFilter.Q.value = 3;

      // LFO to simulate in/out breath rhythm
      const breathLFO = ctx.createOscillator();
      breathLFO.type = 'sine';
      breathLFO.frequency.value = 0.22; // ~one breath per 4.5s
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      breathLFO.connect(lfoGain);
      lfoGain.connect(breathFilter.frequency);

      const breathGain = ctx.createGain();
      breathGain.gain.setValueAtTime(0, time);
      breathGain.gain.linearRampToValueAtTime(0.35, time + 0.5);
      breathGain.gain.linearRampToValueAtTime(0.35, time + 3.0);
      breathGain.gain.exponentialRampToValueAtTime(0.001, time + 4.0);

      bSrc.connect(breathFilter);
      breathFilter.connect(breathGain);
      breathGain.connect(masterGainRef.current);
      breathLFO.start(time);
      bSrc.start(time);
      bSrc.stop(time + 4.5);
      breathLFO.stop(time + 4.5);
    };

    // ── AFK GRADUAL WHISPER — slowly emerges then gets louder ──
    window.startGradualWhisper = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      if (afkWhisperRef.current) return; // already running
      const ctx = audioCtxRef.current;

      // Brown noise through high-Q bandpass — sounds like distant hissing voices
      const bufSize = 4 * ctx.sampleRate;
      const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < bufSize; i++) {
          const w = Math.random() * 2 - 1;
          data[i] = (last + 0.02 * w) / 1.02;
          last = data[i];
          data[i] *= 3.5;
        }
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = buf;
      noiseSrc.loop = true;

      // Two bandpass layers — one for low hiss, one for mid whisper
      const filterLow = ctx.createBiquadFilter();
      filterLow.type = 'bandpass';
      filterLow.frequency.value = 800;
      filterLow.Q.value = 8;

      const filterMid = ctx.createBiquadFilter();
      filterMid.type = 'bandpass';
      filterMid.frequency.value = 2200;
      filterMid.Q.value = 12;

      // Tremolo LFO to simulate voice-like fluctuation
      const tremoloLFO = ctx.createOscillator();
      tremoloLFO.type = 'sine';
      tremoloLFO.frequency.value = 4.5;
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.3;
      tremoloLFO.connect(tremoloGain);

      // Pitch wander LFO — makes filter frequency wobble eerily
      const wanderLFO = ctx.createOscillator();
      wanderLFO.type = 'sine';
      wanderLFO.frequency.value = 0.08; // very slow wander
      const wanderGain = ctx.createGain();
      wanderGain.gain.value = 600;
      wanderLFO.connect(wanderGain);
      wanderGain.connect(filterMid.frequency);

      // Master gain — starts at 0, VERY slowly climbs over 25 seconds
      const whisperGain = ctx.createGain();
      whisperGain.gain.setValueAtTime(0, ctx.currentTime);
      whisperGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 5);
      whisperGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 12);
      whisperGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 22);
      // If user is still AFK at 30s, reaches unsettling max
      whisperGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 30);

      tremoloGain.connect(whisperGain.gain); // tremolo modulates master

      noiseSrc.connect(filterLow);
      noiseSrc.connect(filterMid);
      filterLow.connect(whisperGain);
      filterMid.connect(whisperGain);
      whisperGain.connect(masterGainRef.current);

      noiseSrc.start();
      tremoloLFO.start();
      wanderLFO.start();

      afkWhisperRef.current = { noiseSrc, tremoloLFO, wanderLFO, whisperGain };
    };

    window.stopGradualWhisper = () => {
      if (!afkWhisperRef.current || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const { noiseSrc, tremoloLFO, wanderLFO, whisperGain } = afkWhisperRef.current;

      // Smooth fade out over 1.5 seconds
      whisperGain.gain.cancelScheduledValues(ctx.currentTime);
      whisperGain.gain.setValueAtTime(whisperGain.gain.value, ctx.currentTime);
      whisperGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

      setTimeout(() => {
        try { noiseSrc.stop(); tremoloLFO.stop(); wanderLFO.stop(); } catch (e) {}
      }, 1600);

      afkWhisperRef.current = null;
    };

  }, [jumpscaresEnabled]);

  return (
    <>
      {/* 1. WARNING SCREEN / INTERACTIVE AUDIO GATE */}
      {!hasStarted && (
        <div className="fixed inset-0 bg-[#050505] z-[99999] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-xl p-8 border border-[#1e2226] bg-[#0c0d0f] rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8a0303] to-transparent animate-pulse" />
            
            <ShieldAlert className="w-16 h-16 text-[#8a0303] mx-auto mb-6 animate-pulse" />
            
            <h1 className="text-3xl font-horror-serif tracking-widest text-[#d2e4f0] mb-4">
              WARNING: IMERSIVE EXPERIENCE
            </h1>
            
            <p className="text-sm text-gray-400 font-sans leading-relaxed mb-6">
              This interactive showcase contains dark environments, flickering lights, sudden atmospheric distortions, and psychological horror soundscapes designed to test survival instincts. 
            </p>

            <div className="flex flex-col gap-4 items-center mb-8 bg-[#050505] p-4 rounded border border-gray-900">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-[#8a0303]" />
                <label className="text-sm font-semibold tracking-wider text-gray-300 cursor-pointer">
                  ENABLE ATMOSPHERIC JUMPSCARES
                  <input
                    type="checkbox"
                    checked={jumpscaresEnabled}
                    onChange={(e) => setJumpscaresEnabled(e.target.checked)}
                    className="ml-3 accent-[#8a0303] cursor-pointer"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                (Highly recommended for maximum tension. No graphic gore, atmospheric triggers only.)
              </p>
            </div>

            <button
              onClick={handleStart}
              className="px-8 py-3 text-lg font-horror-serif bg-transparent border-2 border-[#8a0303] text-[#d2e4f0] hover:bg-[#8a0303] hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(138,3,3,0.3)] hover:shadow-[0_0_25px_rgba(138,3,3,0.6)] cursor-pointer tracking-widest relative overflow-hidden group"
            >
              <span className="relative z-10">ENTER THE FOREST</span>
              <div className="absolute inset-0 w-full h-full bg-[#8a0303] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
            
            <div className="mt-6 text-xs text-gray-600 tracking-wider">
              HEADPHONES RECOMMENDED • SOUND IS AN ACTIVE GAMEPLAY ELEMENT
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSISTENT AUDIO CONTROLS (Tucked in top right corner of the website) */}
      {hasStarted && (
        <div className="fixed top-6 right-6 z-[9990] flex items-center gap-4 bg-black/60 backdrop-blur-md border border-[#1e2226] p-3 rounded-full px-4 text-[#d2e4f0] hover:border-gray-800 transition-colors">
          <button
            onClick={togglePlayback}
            className="hover:text-[#8a0303] transition-colors cursor-pointer"
            title={isPlaying ? "Mute Ambient Soundtrack" : "Unmute Ambient Soundtrack"}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isPlaying}
            className="w-16 h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-[#8a0303] disabled:opacity-30"
          />

          <div className="text-[10px] uppercase font-mono tracking-widest font-semibold border-l border-gray-800 pl-3">
            {isPlaying ? (
              <span className="text-[#8a0303] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                SURVIVAL AUDIO
              </span>
            ) : (
              <span className="text-gray-500">MUTED</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
