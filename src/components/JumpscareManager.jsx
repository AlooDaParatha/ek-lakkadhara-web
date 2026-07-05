'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// All jumpscare types
const SCARE_TYPES = ['glitch', 'eyes', 'face', 'scream', 'blackout', 'crack', 'possession', 'creep', 'strobe', 'bottomFlash'];

// How long each scare lasts (ms)
const SCARE_DURATIONS = {
  glitch: 500,
  eyes: 3000,
  face: 180,
  scream: 200,
  blackout: 3500,
  crack: 1200,
  possession: 700,
  creep: 4000,
  strobe: 600,
  bottomFlash: 350,
};

export default function JumpscareManager() {
  const [activeScare, setActiveScare] = useState(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  const activeScareRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const lastScrollY = useRef(0);
  const scrollGlitchTimeout = useRef(null);
  const idleTimer = useRef(null);
  const afkWhisperTimer = useRef(null); // gradual whisper onset timer
  const bottomFiredRef = useRef(false); // bottom-of-page scare flag
  const cooldownRef = useRef(false); // prevent overlapping scares

  const triggerJumpscare = useCallback((type) => {
    if (typeof window !== 'undefined' && window.__jumpscaresEnabled === false) return;
    if (cooldownRef.current) return;

    cooldownRef.current = true;
    activeScareRef.current = type;
    setActiveScare(type);

    // Heavy screen shake for brutal scares
    if (['scream', 'possession', 'strobe', 'crack', 'bottomFlash'].includes(type)) {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 600);
    }

    // Play audio
    if (typeof window !== 'undefined') {
      if (type === 'scream' || type === 'face' || type === 'strobe') {
        if (window.playIntenseScream) window.playIntenseScream();
      } else if (type === 'bottomFlash') {
        // Stop whisper first, then full scream + bass
        if (window.stopGradualWhisper) window.stopGradualWhisper();
        if (window.playIntenseScream) window.playIntenseScream();
        if (window.playBassImpact) window.playBassImpact();
      } else if (type === 'possession' || type === 'crack') {
        if (window.playProceduralJumpscare) window.playProceduralJumpscare();
        if (window.playBassImpact) window.playBassImpact();
      } else if (type === 'blackout' || type === 'creep') {
        if (window.stopGradualWhisper) window.stopGradualWhisper();
        if (window.playDeepBreathing) window.playDeepBreathing();
      } else {
        if (window.playProceduralJumpscare) window.playProceduralJumpscare();
      }
    }

    const duration = SCARE_DURATIONS[type] ?? 400;
    setTimeout(() => {
      setActiveScare(null);
      activeScareRef.current = null;
      // Cooldown before next scare can fire
      setTimeout(() => { cooldownRef.current = false; }, 4000);
    }, duration);
  }, []);

  // Reset idle timer every mouse move — also manages gradual AFK whisper
  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (afkWhisperTimer.current) clearTimeout(afkWhisperTimer.current);

    // Stop any currently-building whisper immediately when user moves
    if (typeof window !== 'undefined' && window.stopGradualWhisper) {
      window.stopGradualWhisper();
    }

    // After 6s idle → start the whispering that slowly gets louder
    afkWhisperTimer.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.startGradualWhisper) {
        window.startGradualWhisper();
      }
    }, 6000);

    // After 20–35s idle → visual + audio scare (whisper has been building)
    const idleWait = 20000 + Math.random() * 15000;
    idleTimer.current = setTimeout(() => {
      if (!cooldownRef.current) {
        if (typeof window !== 'undefined' && window.stopGradualWhisper) window.stopGradualWhisper();
        triggerJumpscare('creep');
      }
    }, idleWait);
  }, [triggerJumpscare]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.triggerManualScare = (type) => triggerJumpscare(type);

    // 1. Random interval — every 20 to 40 seconds (was 60s)
    const interval = setInterval(() => {
      if (cooldownRef.current) return;
      const roll = Math.random();
      if (roll < 0.18) triggerJumpscare('glitch');
      else if (roll < 0.32) triggerJumpscare('eyes');
      else if (roll < 0.45) triggerJumpscare('face');
      else if (roll < 0.56) triggerJumpscare('scream');
      else if (roll < 0.66) triggerJumpscare('blackout');
      else if (roll < 0.74) triggerJumpscare('crack');
      else if (roll < 0.82) triggerJumpscare('possession');
      else if (roll < 0.91) triggerJumpscare('strobe');
      // ~9% chance nothing happens — keeps user on edge
    }, 20000 + Math.random() * 20000);

    // 2. Fast scroll → glitch or crack; also detect page bottom
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const speed = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      // Fast scroll glitch
      if (speed > 70 && !cooldownRef.current && Math.random() < 0.06) {
        if (!scrollGlitchTimeout.current) {
          triggerJumpscare(Math.random() < 0.5 ? 'glitch' : 'crack');
          scrollGlitchTimeout.current = setTimeout(() => {
            scrollGlitchTimeout.current = null;
          }, 500);
        }
      }

      // Bottom-of-page detection — only fires once per 2 minutes
      if (!bottomFiredRef.current && !cooldownRef.current) {
        const scrollBottom = window.scrollY + window.innerHeight;
        const pageHeight = document.body.scrollHeight;
        if (scrollBottom >= pageHeight - 80) {
          bottomFiredRef.current = true;
          triggerJumpscare('bottomFlash');
          // Re-arm after 2 minutes so returning users get scared again
          setTimeout(() => { bottomFiredRef.current = false; }, 120000);
        }
      }
    };

    // 3. Fast mouse → whisper + possible strobe
    const handleMouseMove = (e) => {
      resetIdleTimer();
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      if (dt > 80) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / dt;

        if (speed > 5 && Math.random() < 0.025 && !cooldownRef.current) {
          if (window.playProceduralWhisper) window.playProceduralWhisper();
          if (Math.random() < 0.15) triggerJumpscare('strobe');
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    // 4. Tab visibility — coming back to tab triggers a scare
    const handleVisibility = () => {
      if (!document.hidden && !cooldownRef.current) {
        setTimeout(() => {
          if (!cooldownRef.current) {
            const opts = ['scream', 'possession', 'eyes', 'face'];
            triggerJumpscare(opts[Math.floor(Math.random() * opts.length)]);
          }
        }, 800); // Short delay so they see the site first
      }
    };

    // 5. Window blur (they tried to leave)
    const handleBlur = () => {
      if (window.playProceduralWhisper) window.playProceduralWhisper();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    resetIdleTimer();

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      if (scrollGlitchTimeout.current) clearTimeout(scrollGlitchTimeout.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (afkWhisperTimer.current) clearTimeout(afkWhisperTimer.current);
      if (typeof window !== 'undefined' && window.stopGradualWhisper) window.stopGradualWhisper();
    };
  }, [triggerJumpscare, resetIdleTimer]);

  return (
    <>
      {/* Screen shake wrapper */}
      <AnimatePresence>
        {shakeScreen && (
          <motion.div
            key="screen-shake"
            className="fixed inset-0 z-[9998] pointer-events-none"
            animate={{ x: [0, -12, 10, -8, 6, -4, 2, 0], y: [0, 8, -10, 6, -4, 3, -1, 0] }}
            transition={{ duration: 0.55, ease: 'linear' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>

        {/* ─── A. SCREEN STATIC GLITCH ─── */}
        {activeScare === 'glitch' && (
          <motion.div
            key="glitch-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.3, 0.85, 0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'linear' }}
            className="fixed inset-0 bg-[#080808] z-[9995] pointer-events-none flex items-center justify-center mix-blend-difference"
          >
            <div className="scanlines absolute inset-0" />
            <div className="text-[#8a0303] font-horror-serif text-8xl tracking-widest rune-glow uppercase select-none opacity-50 chromatic-aberration">
              STATIC LOST
            </div>
            <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
          </motion.div>
        )}

        {/* ─── B. GLOWING EYES IN DARKNESS ─── */}
        {activeScare === 'eyes' && (
          <motion.div
            key="eyes-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.7, 1, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, times: [0, 0.1, 0.75, 0.82, 0.88, 0.92, 1] }}
            className="fixed inset-0 bg-black/97 z-[9994] pointer-events-none flex items-center justify-center"
          >
            {/* Multiple sets of eyes at different depths */}
            <div className="relative w-full h-full">
              {/* Main large eyes — centre */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-20 items-center">
                <div className="w-10 h-5 bg-red-600 rounded-full blur-[1px] shadow-[0_0_30px_8px_#ff0000] relative overflow-hidden">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto mt-[4px] animate-pulse" />
                </div>
                <div className="w-10 h-5 bg-red-600 rounded-full blur-[1px] shadow-[0_0_30px_8px_#ff0000] relative overflow-hidden">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto mt-[4px] animate-pulse" />
                </div>
              </div>
              {/* Smaller distant eyes — upper left */}
              <div className="absolute top-[30%] left-[20%] flex gap-8 items-center opacity-50">
                <div className="w-4 h-2 bg-orange-700 rounded-full blur-[1px] shadow-[0_0_12px_4px_#aa3300]" />
                <div className="w-4 h-2 bg-orange-700 rounded-full blur-[1px] shadow-[0_0_12px_4px_#aa3300]" />
              </div>
              {/* Smaller distant eyes — lower right */}
              <div className="absolute top-[65%] right-[18%] flex gap-6 items-center opacity-35">
                <div className="w-3 h-1.5 bg-red-800 rounded-full blur-[1px] shadow-[0_0_10px_3px_#880000]" />
                <div className="w-3 h-1.5 bg-red-800 rounded-full blur-[1px] shadow-[0_0_10px_3px_#880000]" />
              </div>
            </div>
            <div className="absolute bottom-1/4 text-center w-full font-mono text-sm text-red-700 tracking-[0.4em] uppercase opacity-60 animate-pulse">
              they are all watching
            </div>
          </motion.div>
        )}

        {/* ─── C. FACE FLASH (classic) ─── */}
        {activeScare === 'face' && (
          <motion.div
            key="face-scare"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.98, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-[#050505] z-[9996] pointer-events-none flex items-center justify-center"
          >
            <div className="w-[90vw] h-[90vh] max-w-3xl max-h-3xl filter contrast-[300%] brightness-[35%] mix-blend-screen select-none" style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}>
              <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M150 100 Q250 80 350 100 Q400 200 400 300 Q400 450 250 480 Q100 450 100 300 Q100 200 150 100 Z" fill="#1c0404" stroke="#8a0303" strokeWidth="4" />
                <circle cx="200" cy="220" r="30" fill="#000" stroke="#ff0000" strokeWidth="4" />
                <circle cx="300" cy="220" r="30" fill="#000" stroke="#ff0000" strokeWidth="4" />
                <circle cx="200" cy="220" r="10" fill="#ffffff" />
                <circle cx="300" cy="220" r="10" fill="#ffffff" />
                <path d="M160 360 Q250 420 340 360" stroke="#8a0303" strokeWidth="7" strokeLinecap="round" />
                <line x1="185" y1="350" x2="185" y2="390" stroke="#8a0303" strokeWidth="4" />
                <line x1="215" y1="358" x2="215" y2="398" stroke="#8a0303" strokeWidth="4" />
                <line x1="250" y1="365" x2="250" y2="405" stroke="#8a0303" strokeWidth="4" />
                <line x1="285" y1="358" x2="285" y2="398" stroke="#8a0303" strokeWidth="4" />
                <line x1="315" y1="350" x2="315" y2="390" stroke="#8a0303" strokeWidth="4" />
                <path d="M110 130 L390 130 L350 50 L150 50 Z" fill="#0c0202" stroke="#8a0303" strokeWidth="3" />
                {/* Axe outline */}
                <path d="M420 380 L460 340 L480 360 L450 400 Z" fill="#3a0000" stroke="#8a0303" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-[#8a0303]/20 mix-blend-color" />
          </motion.div>
        )}

        {/* ─── D. FULL SCREAM — AGGRESSIVE full-screen face + full white flash ─── */}
        {activeScare === 'scream' && (
          <motion.div
            key="scream-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, times: [0, 0.1, 0.5, 0.7, 1] }}
            className="fixed inset-0 z-[9997] pointer-events-none"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Pure white flash then aggressive face */}
            <div className="absolute inset-0 flex items-center justify-center bg-black" style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}>
              <svg viewBox="0 0 600 700" className="w-[95vw] h-[95vh] max-w-3xl max-h-3xl" fill="none">
                {/* Head */}
                <ellipse cx="300" cy="340" rx="200" ry="280" fill="#0a0000" stroke="#cc0000" strokeWidth="5" />
                {/* Wide-open terrified eyes */}
                <ellipse cx="220" cy="260" rx="45" ry="55" fill="#fff" stroke="#cc0000" strokeWidth="4" />
                <circle cx="220" cy="275" r="25" fill="#000" />
                <circle cx="230" cy="265" r="8" fill="#fff" />
                <ellipse cx="380" cy="260" rx="45" ry="55" fill="#fff" stroke="#cc0000" strokeWidth="4" />
                <circle cx="380" cy="275" r="25" fill="#000" />
                <circle cx="390" cy="265" r="8" fill="#fff" />
                {/* Wide screaming mouth */}
                <ellipse cx="300" cy="430" rx="80" ry="60" fill="#0a0000" stroke="#cc0000" strokeWidth="5" />
                <path d="M230 430 Q300 500 370 430" fill="#330000" />
                {/* Teeth */}
                <rect x="255" y="400" width="18" height="35" fill="#eeeeee" rx="2" />
                <rect x="278" y="395" width="18" height="40" fill="#eeeeee" rx="2" />
                <rect x="302" y="395" width="18" height="40" fill="#eeeeee" rx="2" />
                <rect x="326" y="400" width="18" height="35" fill="#eeeeee" rx="2" />
                {/* Hair / hat */}
                <path d="M100 200 L500 200 L460 80 L140 80 Z" fill="#050000" stroke="#cc0000" strokeWidth="3" />
                {/* Cracks / scars */}
                <path d="M200 180 L220 220 L205 260" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
                <path d="M350 300 L380 320 L370 360" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-red-900/30" />
          </motion.div>
        )}

        {/* ─── E. BLACKOUT — total darkness + slow breathing + snap on ─── */}
        {activeScare === 'blackout' && (
          <motion.div
            key="blackout-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, times: [0, 0.05, 0.8, 0.9, 1] }}
            className="fixed inset-0 bg-black z-[9994] pointer-events-none flex items-center justify-center"
          >
            {/* Slow pulsing eyes appear mid-blackout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.8, 1, 0.7, 0] }}
              transition={{ duration: 3.2, times: [0, 0.35, 0.5, 0.7, 0.85, 1] }}
              className="flex gap-24 items-center"
            >
              <div className="w-12 h-6 bg-red-700 rounded-full shadow-[0_0_40px_12px_#ff0000]" />
              <div className="w-12 h-6 bg-red-700 rounded-full shadow-[0_0_40px_12px_#ff0000]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.6, 0] }}
              transition={{ duration: 3.2, times: [0, 0.5, 0.7, 1] }}
              className="absolute bottom-1/3 text-center w-full font-mono text-base tracking-[0.5em] uppercase text-red-800"
            >
              you cannot run
            </motion.div>
          </motion.div>
        )}

        {/* ─── F. SCREEN CRACKS ─── */}
        {activeScare === 'crack' && (
          <motion.div
            key="crack-scare"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 1, 0.9, 0.8, 0], scale: [1, 1.02, 1, 0.99, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="fixed inset-0 z-[9995] pointer-events-none"
          >
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              {/* Crack lines from centre */}
              <path d="M960 540 L820 200 L790 50" stroke="#cc0000" strokeWidth="4" fill="none" opacity="0.9" />
              <path d="M960 540 L1150 180 L1200 30" stroke="#cc0000" strokeWidth="3" fill="none" opacity="0.8" />
              <path d="M960 540 L600 700 L400 1000" stroke="#cc0000" strokeWidth="5" fill="none" opacity="0.9" />
              <path d="M960 540 L1300 750 L1600 1080" stroke="#cc0000" strokeWidth="4" fill="none" opacity="0.85" />
              <path d="M960 540 L350 460 L100 350" stroke="#cc0000" strokeWidth="3" fill="none" opacity="0.7" />
              <path d="M960 540 L1600 480 L1900 400" stroke="#cc0000" strokeWidth="3" fill="none" opacity="0.7" />
              {/* Secondary cracks */}
              <path d="M820 200 L700 300 L550 250" stroke="#880000" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M1150 180 L1280 300 L1400 220" stroke="#880000" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M600 700 L480 800 L300 850" stroke="#880000" strokeWidth="2" fill="none" opacity="0.5" />
              {/* Crack impact glow */}
              <circle cx="960" cy="540" r="40" fill="#cc0000" opacity="0.5" />
              <circle cx="960" cy="540" r="80" fill="#880000" opacity="0.2" />
            </svg>
            <div className="absolute inset-0 bg-red-950/25" />
          </motion.div>
        )}

        {/* ─── G. POSSESSION — page inverts and shakes ─── */}
        {activeScare === 'possession' && (
          <motion.div
            key="possession-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, times: [0, 0.05, 0.5, 0.85, 1] }}
            className="fixed inset-0 z-[9997] pointer-events-none"
            style={{ mixBlendMode: 'difference', backgroundColor: '#ffffff' }}
          >
            <motion.div
              className="absolute inset-0 bg-red-700/40"
              animate={{ opacity: [0.4, 0, 0.6, 0, 0.5, 0] }}
              transition={{ duration: 0.65, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-white font-horror-serif text-[10vw] tracking-widest select-none"
                animate={{ scaleX: [1, -1, 1, -1, 1], skewX: [0, 5, -5, 3, 0] }}
                transition={{ duration: 0.65, ease: 'linear' }}
                style={{ textShadow: '0 0 40px #ff0000' }}
              >
                EK LAKKADHARA
              </motion.div>
            </div>
            <div className="scanlines absolute inset-0" />
          </motion.div>
        )}

        {/* ─── H. CREEPER — silhouette slowly approaches from corner ─── */}
        {activeScare === 'creep' && (
          <motion.div
            key="creep-scare"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.8, times: [0, 0.08, 0.88, 1] }}
            className="fixed inset-0 bg-black/88 z-[9993] pointer-events-none overflow-hidden"
          >
            {/* Silhouette creeping from bottom-right */}
            <motion.div
              initial={{ x: '40vw', y: '60vh', scale: 0.3, opacity: 0 }}
              animate={{ x: '5vw', y: '5vh', scale: 1.1, opacity: [0, 0.7, 0.85, 0.7, 0] }}
              transition={{ duration: 3.8, ease: 'easeIn' }}
              className="absolute"
            >
              <svg viewBox="0 0 250 500" width="200" height="400" fill="none">
                {/* Body silhouette */}
                <ellipse cx="125" cy="80" rx="60" ry="70" fill="#0a0000" />
                <rect x="65" y="140" width="120" height="200" rx="20" fill="#0a0000" />
                {/* Axe */}
                <rect x="190" y="150" width="10" height="160" fill="#0a0000" />
                <path d="M190 150 L240 120 L250 160 L200 180 Z" fill="#1a0000" stroke="#440000" strokeWidth="2" />
                {/* Glowing eyes */}
                <circle cx="105" cy="70" r="12" fill="#ff0000" opacity="0.9" />
                <circle cx="145" cy="70" r="12" fill="#ff0000" opacity="0.9" />
                <circle cx="105" cy="70" r="5" fill="#ffaa00" />
                <circle cx="145" cy="70" r="5" fill="#ffaa00" />
              </svg>
            </motion.div>
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 font-mono text-red-900 text-xs tracking-[0.5em] uppercase animate-pulse">
              he found you
            </div>
          </motion.div>
        )}

        {/* ─── I. STROBE — rapid red/white flashes ─── */}
        {activeScare === 'strobe' && (
          <motion.div
            key="strobe-scare"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0.7, 0],
              backgroundColor: ['#ffffff', '#ff0000', '#ffffff', '#000000', '#ff0000', '#ffffff', '#000000', '#ff0000', '#000000', '#050505', '#000000'],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'linear' }}
            className="fixed inset-0 z-[9997] pointer-events-none"
          />
        )}

        {/* ─── J. BOTTOM FLASH — blinding scream when reaching page end ─── */}
        {activeScare === 'bottomFlash' && (
          <motion.div
            key="bottom-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.9, 1, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, times: [0, 0.06, 0.2, 0.4, 0.6, 0.8, 1] }}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* White flash first, then face emerges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{ duration: 0.32, times: [0, 0.15, 0.3, 0.7, 1] }}
              className="absolute inset-0 flex items-center justify-center bg-[#000000]"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            >
              <svg viewBox="0 0 600 700" className="w-[95vw] h-[95vh] max-w-4xl max-h-4xl" fill="none">
                {/* Head — bigger and more distorted */}
                <ellipse cx="300" cy="340" rx="210" ry="290" fill="#060000" stroke="#ff0000" strokeWidth="7" />
                {/* Wide-open terrorised eyes */}
                <ellipse cx="215" cy="255" rx="52" ry="62" fill="#fff" stroke="#ff0000" strokeWidth="6" />
                <circle cx="215" cy="272" r="30" fill="#000" />
                <circle cx="228" cy="260" r="11" fill="#fff" />
                <ellipse cx="385" cy="255" rx="52" ry="62" fill="#fff" stroke="#ff0000" strokeWidth="6" />
                <circle cx="385" cy="272" r="30" fill="#000" />
                <circle cx="398" cy="260" r="11" fill="#fff" />
                {/* Screaming mouth — massive open */}
                <ellipse cx="300" cy="440" rx="95" ry="80" fill="#060000" stroke="#ff0000" strokeWidth="7" />
                <path d="M215 440 Q300 530 385 440" fill="#280000" />
                {/* Teeth — sharp, jagged */}
                <rect x="245" y="400" width="22" height="48" fill="#eeeeee" rx="3" />
                <rect x="272" y="392" width="22" height="56" fill="#eeeeee" rx="3" />
                <rect x="299" y="388" width="22" height="60" fill="#eeeeee" rx="3" />
                <rect x="326" y="392" width="22" height="56" fill="#eeeeee" rx="3" />
                <rect x="353" y="400" width="22" height="48" fill="#eeeeee" rx="3" />
                {/* Blood drip from mouth */}
                <path d="M290 460 Q288 510 292 540" stroke="#cc0000" strokeWidth="5" strokeLinecap="round" />
                <path d="M315 455 Q318 500 314 525" stroke="#cc0000" strokeWidth="4" strokeLinecap="round" />
                {/* Hat */}
                <path d="M95 210 L505 210 L462 75 L138 75 Z" fill="#030000" stroke="#ff0000" strokeWidth="4" />
                {/* Face cracks */}
                <path d="M215 180 L240 230 L220 280" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M370 190 L350 240 L375 290" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M280 300 L260 340 L275 380" stroke="#880000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
            {/* Red vignette */}
            <div className="absolute inset-0 bg-red-900/40 pointer-events-none" />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Epilepsy warning appended to strobe via aria */}
      <div aria-live="assertive" className="sr-only">
        {activeScare === 'strobe' ? 'Strobe effect active' : ''}
      </div>
    </>
  );
}
