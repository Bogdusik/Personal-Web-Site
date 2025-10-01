import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('portfolio-language');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('uk') || browserLang.startsWith('ru')) {
      return 'uk';
    }
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'uk' : 'en');
  };

  const value = {
    language,
    toggleLanguage,
    isEnglish: language === 'en',
    isUkrainian: language === 'uk'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
