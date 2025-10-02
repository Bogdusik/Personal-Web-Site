import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useSwipeToNavigate } from './hooks/useSwipeNavigation';
import Header from './components/Header';
import Hero from './components/Hero';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

// Lazy load components for better performance
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const InteractiveDemo = lazy(() => import('./components/InteractiveDemo'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

const App = React.memo(() => {
  const [currentSection, setCurrentSection] = useState('hero');
  const sections = ['hero', 'about', 'skills', 'projects', 'demo', 'contact', 'footer'];
  
  // Swipe navigation for mobile
  const swipeHandlers = useSwipeToNavigate(sections, currentSection, setCurrentSection);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200;

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
  }, [sections]);

  useEffect(() => {
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
  }, [handleScroll]);

  return (
    <ThemeProvider>
      <div 
        className="App"
        {...swipeHandlers}
      >
        <ParticleBackground />
        <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
        
        <div className="main-content">
          <Hero />
          <Suspense fallback={<div className="loading-placeholder">Loading About...</div>}>
            <About />
          </Suspense>
          <Suspense fallback={<div className="loading-placeholder">Loading Skills...</div>}>
            <Skills />
          </Suspense>
          <Suspense fallback={<div className="loading-placeholder">Loading Projects...</div>}>
            <Projects />
          </Suspense>
          <Suspense fallback={<div className="loading-placeholder">Loading Demo...</div>}>
            <InteractiveDemo />
          </Suspense>
          <Suspense fallback={<div className="loading-placeholder">Loading Contact...</div>}>
            <Contact />
          </Suspense>
          <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
});

App.displayName = 'App';

export default App;
