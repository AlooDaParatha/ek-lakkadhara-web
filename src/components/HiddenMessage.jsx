'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function HiddenMessage({ text, className = '' }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [flashlightActive, setFlashlightActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check flashlight status on mount
    setFlashlightActive(!!window.__flashlightActive);

    const handleToggle = (e) => {
      setFlashlightActive(e.detail.active);
      if (!e.detail.active) setIsVisible(false);
    };

    const handleMove = (e) => {
      if (!window.__flashlightActive) {
        setIsVisible(false);
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Mouse distance check
      const dx = e.detail.x - centerX;
      const dy = e.detail.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Spotlight circle radius is 140px
      if (distance < 140) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('flashlightToggle', handleToggle);
    window.addEventListener('flashlightMove', handleMove);

    return () => {
      window.removeEventListener('flashlightToggle', handleToggle);
      window.removeEventListener('flashlightMove', handleMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        opacity: isVisible && flashlightActive ? 0.75 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 0.3s ease, filter 0.4s ease',
      }}
      className={`text-[#8a0303] font-horror-journal tracking-widest text-xs uppercase rune-glow pointer-events-none select-none ${className}`}
    >
      {text}
    </div>
  );
}
