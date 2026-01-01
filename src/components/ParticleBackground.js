import React, { useEffect, useRef, useCallback } from 'react';
import { PARTICLE_CONFIG } from '../utils/constants';
import './ParticleBackground.css';

const ParticleBackground = React.memo(() => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particlesRef.current = [];
    const particleCount = Math.min(
      PARTICLE_CONFIG.MAX_COUNT, 
      Math.floor((canvas.width * canvas.height) / PARTICLE_CONFIG.DENSITY_DIVISOR)
    );
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
        vy: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Simplified connections (reduce complexity)
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length - 1; i += 2) { // Skip every other particle
      for (let j = i + 2; j < particles.length; j += 2) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PARTICLE_CONFIG.CONNECTION_DISTANCE) {
          ctx.save();
          ctx.globalAlpha = (PARTICLE_CONFIG.CONNECTION_DISTANCE - distance) / PARTICLE_CONFIG.CONNECTION_DISTANCE * 0.1;
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas, initParticles, animate]);

  return (
    <div className="particle-background">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="gradient-overlay" />
    </div>
  );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
