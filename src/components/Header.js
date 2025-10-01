import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaUser, FaCogs, FaProjectDiagram, FaGamepad, FaEnvelope } from 'react-icons/fa';
import './Header.css';

const Header = ({ currentSection, setCurrentSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: FaCode },
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'skills', label: 'Skills', icon: FaCogs },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'demo', label: 'Demo', icon: FaGamepad },
    { id: 'contact', label: 'Contact', icon: FaEnvelope }
  ];

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Более плавный скролл с задержкой
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
    setCurrentSection(sectionId);
  };

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCode className="logo-icon" />
          <span>Bohdan</span>
        </motion.div>

        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <motion.div
          className="mobile-menu-toggle"
          whileTap={{ scale: 0.95 }}
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
