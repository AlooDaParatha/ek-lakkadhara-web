'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, LightbulbOff, Battery, Zap } from 'lucide-react';

export default function FlashlightOverlay() {
  const [isOn, setIsOn] = useState(false);
  const [battery, setBattery] = useState(100);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isFlickering, setIsFlickering] = useState(false);
  const [showBatteryRefill, setShowBatteryRefill] = useState(false);

  const batteryIntervalRef = useRef(null);

  // Expose flashlight states globally
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__flashlightActive = isOn && battery > 0;
    
    // Dispatch event so sub-components can re-evaluate distance
    const event = new CustomEvent('flashlightToggle', { detail: { active: isOn && battery > 0 } });
    window.dispatchEvent(event);
  }, [isOn, battery]);

  // Mouse move listener to update coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (typeof window !== 'undefined') {
        window.__mouseX = e.clientX;
        window.__mouseY = e.clientY;
        // Dispatch coordinates update event
        window.dispatchEvent(new CustomEvent('flashlightMove', { detail: { x: e.clientX, y: e.clientY } }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Battery drain logic
  useEffect(() => {
    if (isOn && battery > 0) {
      batteryIntervalRef.current = setInterval(() => {
        setBattery((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(batteryIntervalRef.current);
            setIsOn(false);
            return 0;
          }
          // Flickering triggers when battery is below 20%
          if (next < 20 && Math.random() < 0.3) {
            setIsFlickering(true);
            setTimeout(() => setIsFlickering(false), 150);
          }
          // Spawn a battery refill pack occasionally when battery gets low
          if (next === 50 || next === 25) {
            setShowBatteryRefill(true);
          }
          return next;
        });
      }, 1000);
    } else {
      if (batteryIntervalRef.current) clearInterval(batteryIntervalRef.current);
    }

    return () => {
      if (batteryIntervalRef.current) clearInterval(batteryIntervalRef.current);
    };
  }, [isOn, battery]);

  // Key press listener ('F' key to toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'f') {
        // Only toggle if warning screen is already dismissed (gameStarted)
        if (typeof window !== 'undefined' && window.__jumpscaresEnabled !== undefined) {
          toggleFlashlight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOn, battery]);

  // Recharge trigger exposed globally
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.rechargeFlashlight = () => {
      setBattery(100);
      setIsOn(true);
      setShowBatteryRefill(false);
      if (window.playProceduralWhisper) {
        window.playProceduralWhisper();
      }
    };
  }, []);

  const toggleFlashlight = () => {
    if (battery <= 0) {
      // Play dead click sound
      if (window.playProceduralWhisper) window.playProceduralWhisper();
      return;
    }
    
    setIsOn((prev) => !prev);
    // Play light click sound
    if (window.playProceduralWhisper) window.playProceduralWhisper();
  };

  const handleRefillClick = () => {
    if (typeof window !== 'undefined' && window.rechargeFlashlight) {
      window.rechargeFlashlight();
    }
  };

  // Mask string centering on cursor
  const maskStyle = isOn && battery > 0 && !isFlickering
    ? {
        background: `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, rgba(5,5,5,0.96) 80%)`,
      }
    : isOn && isFlickering
    ? {
        background: 'rgba(5,5,5,0.98)', // Pitch black during flicker
      }
    : {};

  return (
    <>
      {/* 1. Full-screen shadows spotlight mask (Runs when ON) */}
      {isOn && (
        <div
          style={maskStyle}
          className="fixed inset-0 pointer-events-none z-[9985] transition-all duration-75 mix-blend-multiply"
        />
      )}

      {/* 2. Floating Flashlight Controller UI (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-3 bg-black/60 backdrop-blur-md border border-[#1e2226] p-3 rounded-full px-4 text-[#d2e4f0] select-none">
        
        {/* Battery Bar */}
        <div className="flex items-center gap-1.5 border-r border-gray-800 pr-3">
          <Battery className={`w-4 h-4 ${battery < 20 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <span className={`text-xs font-mono font-semibold ${battery < 20 ? 'text-red-500' : 'text-slate-300'}`}>
            {battery}%
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleFlashlight}
          className={`flex items-center justify-center p-1 rounded-full cursor-pointer transition-colors ${
            isOn ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-500 hover:text-slate-200'
          }`}
          title="Toggle Flashlight (Press 'F')"
        >
          {isOn ? <Lightbulb className="w-5 h-5 animate-pulse" /> : <LightbulbOff className="w-5 h-5" />}
        </button>

        <span className="text-[9px] font-mono text-gray-500 tracking-wider hidden sm:inline">
          [F] FLASHLIGHT
        </span>
      </div>

      {/* 3. Interactive Battery Pack Spawner Easter Egg (Floating near top sections) */}
      <AnimatePresence>
        {showBatteryRefill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 0.8, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            onClick={handleRefillClick}
            className="fixed top-1/3 left-12 z-[9987] bg-linear-to-b from-green-950 to-black border border-green-700/60 p-4 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer flex flex-col items-center gap-2 select-none"
          >
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-green-400">
              BATTERY REFILL
            </div>
            <div className="text-[8px] font-mono text-gray-500">
              [ CLICK TO PICKUP ]
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
