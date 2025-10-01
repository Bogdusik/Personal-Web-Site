import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaDownload, FaCode, FaRocket } from 'react-icons/fa';
import { ReactTyped } from 'react-typed';
import './Hero.css';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const skills = [
    'Full-Stack Developer',
    'React Specialist',
    'Spring Boot Expert',
    'Cyber Security Analyst',
    'Problem Solver'
  ];

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
              onClick={() => {
                const element = document.getElementById('projects');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <FaRocket className="btn-icon" />
              View My Work
            </motion.button>
            
            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Simulate CV download
                const link = document.createElement('a');
                link.href = '/cv.pdf';
                link.download = 'Bohdan_CV.pdf';
                link.click();
              }}
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
              href="https://linkedin.com/in/bohdan-developer"
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
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        onClick={() => {
          const element = document.getElementById('about');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaCode />
        </motion.div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
};

export default Hero;
