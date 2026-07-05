'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth out mouse tracking with springs
  const springConfig = { damping: 40, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    const moveMouse = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      // Check if target or parent is interactive
      const isInteractive = 
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.closest('.interactive-card') ||
        e.target.classList.contains('clickable');
      
      setHovered(isInteractive);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible || isTouchDevice) return null;

  return (
    <>
      {/* Primary Lantern Core */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          scale: clicked ? 0.8 : hovered ? 1.5 : 1,
          border: hovered ? '2px solid rgba(138, 3, 3, 0.8)' : '1px solid rgba(210, 228, 240, 0.4)',
          backgroundColor: hovered ? 'rgba(138, 3, 3, 0.15)' : 'rgba(210, 228, 240, 0.05)',
          boxShadow: hovered 
            ? '0 0 15px 5px rgba(138, 3, 3, 0.5), inset 0 0 8px rgba(138, 3, 3, 0.3)' 
            : '0 0 10px 2px rgba(210, 228, 240, 0.2), inset 0 0 4px rgba(210, 228, 240, 0.1)',
        }}
      >
        {/* Glowing wick inside the lantern */}
        <motion.div
          className="absolute inset-0 m-auto w-2 h-2 rounded-full"
          style={{
            backgroundColor: hovered ? '#8a0303' : '#d2e4f0',
            boxShadow: hovered 
              ? '0 0 8px #ff0000' 
              : '0 0 6px #ffffff',
          }}
          animate={{
            scale: [1, 0.9, 1.1, 1],
            opacity: [0.8, 0.5, 0.9, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.15,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Ambient outer fog halo around cursor */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 -translate-x-12 -translate-y-12 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          background: hovered 
            ? 'radial-gradient(circle, rgba(138,3,3,0.1) 0%, rgba(138,3,3,0) 70%)'
            : 'radial-gradient(circle, rgba(210,228,240,0.05) 0%, rgba(210,228,240,0) 70%)',
        }}
      />
    </>
  );
}
