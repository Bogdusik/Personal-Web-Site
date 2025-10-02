import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaDownload, FaRocket } from 'react-icons/fa';
import { ReactTyped } from 'react-typed';
import './Hero.css';

const Hero = React.memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  const skills = useMemo(() => [
    'Full-Stack Developer',
    'React Specialist',
    'Spring Boot Expert',
    'Cyber Security Analyst',
    'Problem Solver'
  ], []);

  const handleProjectsClick = useCallback(() => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCVDownload = useCallback(() => {
    try {
      // Первый способ - прямое скачивание
      const link = document.createElement('a');
      link.href = '/CV-Bohdan-Bozhenko.pdf';
      link.download = 'CV-Bohdan-Bozhenko.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Добавляем в DOM для совместимости с некоторыми браузерами
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Fallback - если скачивание не сработало, открываем в новой вкладке
      setTimeout(() => {
        window.open('/CV-Bohdan-Bozhenko.pdf', '_blank', 'noopener,noreferrer');
      }, 100);
      
    } catch (error) {
      console.error('Error downloading CV:', error);
      // Резервный вариант - открыть в новой вкладке
      window.open('/CV-Bohdan-Bozhenko.pdf', '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleScrollClick = useCallback(() => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <div 
          className="floating-shape shape-1"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="floating-shape shape-2"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
        <div 
          className="floating-shape shape-3"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hi, I'm <span className="highlight">Bohdan</span>
          </motion.h1>

          <motion.div
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ReactTyped
              strings={skills}
              typeSpeed={50}
              backSpeed={30}
              backDelay={2000}
              loop
              className="typed-text"
            />
          </motion.div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            A passionate Computing student with expertise in full-stack development, 
            cybersecurity, and creating innovative solutions. Ready to bring fresh 
            ideas and technical excellence to your team.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProjectsClick}
            >
              <FaRocket className="btn-icon" />
              View My Work
            </motion.button>
            
            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCVDownload}
            >
              <FaDownload className="btn-icon" />
              Download CV
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.a
              href="https://github.com/Bogdusik"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
                   <motion.a
                     href="https://www.linkedin.com/in/bohdan-bozhenko/"
                     target="_blank"
                     rel="noopener noreferrer"
                     whileHover={{ scale: 1.2, rotate: 5 }}
                     whileTap={{ scale: 0.9 }}
                   >
                     <FaLinkedin />
                   </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="code-window">
            <div className="window-header">
              <div className="window-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
              <div className="window-title">portfolio.js</div>
            </div>
            <div className="window-content">
              <div className="code-line">
                <span className="keyword">const</span> <span className="variable">developer</span> = <span className="string">'Bohdan'</span>;
              </div>
              <div className="code-line">
                <span className="keyword">const</span> <span className="variable">skills</span> = [
              </div>
              <div className="code-line indent">
                <span className="string">'React'</span>, <span className="string">'Spring Boot'</span>,
              </div>
              <div className="code-line indent">
                <span className="string">'JavaScript'</span>, <span className="string">'Java'</span>,
              </div>
              <div className="code-line indent">
                <span className="string">'PostgreSQL'</span>, <span className="string">'AWS'</span>
              </div>
              <div className="code-line">];</div>
              <div className="code-line">
                <span className="keyword">return</span> <span className="variable">innovative</span>.<span className="function">solutions</span>();
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: scrollY > 50 ? 0 : 1,
          y: scrollY > 50 ? 20 : 0
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={handleScrollClick}
        style={{ 
          cursor: 'pointer',
          pointerEvents: scrollY > 50 ? 'none' : 'auto'
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.8,
            type: "spring",
            stiffness: 100
          }}
          className="scroll-text"
        >
          Scroll to explore
        </motion.span>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
