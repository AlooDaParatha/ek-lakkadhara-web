'use client';

import React, { useEffect, useRef } from 'react';

export default function FogCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const maxParticles = 65;
    
    // Mouse interaction variables
    const mouse = { x: -1000, y: -1000, radius: 200, active: false };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle Class
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        // Start below the screen or randomly spread on init
        this.y = init ? Math.random() * canvas.height : canvas.height + Math.random() * 100;
        this.size = Math.random() * 200 + 150; // Big soft puffs
        this.baseSpeedX = Math.random() * 0.4 - 0.2;
        this.baseSpeedY = -(Math.random() * 0.3 + 0.1); // Drifts upwards
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.12 + 0.03; // Very soft and subtle
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.state = 'fadein'; // fadein, active, fadeout
      }

      update() {
        // Move
        this.x += this.speedX;
        this.y += this.speedY;

        // Interaction with mouse cursor
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Push away gently
            this.x += (dx / distance) * force * 2.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }

        // Handle fading states
        if (this.state === 'fadein') {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= this.maxOpacity) {
            this.opacity = this.maxOpacity;
            this.state = 'active';
          }
        } else if (this.state === 'fadeout') {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0) {
            this.reset();
          }
        }

        // Out of bounds checks
        if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
          this.state = 'fadeout';
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        // Create radial gradient for soft mist puffs
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 10,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(44, 53, 57, ${this.opacity})`); // foggy blue
        gradient.addColorStop(0.5, `rgba(18, 20, 22, ${this.opacity * 0.4})`); // dark grey
        gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-70 mix-blend-screen"
    />
  );
}
