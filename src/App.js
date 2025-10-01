import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useSwipeToNavigate } from './hooks/useSwipeNavigation';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

// Lazy load heavy components
const Projects = lazy(() => import('./components/Projects'));
const InteractiveDemo = lazy(() => import('./components/InteractiveDemo'));

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const sections = ['hero', 'about', 'skills', 'projects', 'demo', 'contact', 'footer'];
  
  // Swipe navigation for mobile
  const swipeHandlers = useSwipeToNavigate(sections, currentSection, setCurrentSection);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Увеличиваем отступ для более плавного переключения

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sections[i]);
            break;
          }
        }
      }
    };

    // Добавляем throttling для более плавной работы
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [sections]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div 
          className="App"
          {...swipeHandlers}
        >
          <ParticleBackground />
          <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
          
          <div className="main-content">
            <Hero />
            <About />
            <Skills />
            <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
              <Projects />
            </Suspense>
            <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
              <InteractiveDemo />
            </Suspense>
            <Contact />
            <Footer />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
