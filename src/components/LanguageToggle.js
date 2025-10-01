import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage, isEnglish } = useLanguage();

  return (
    <motion.button
      className="language-toggle"
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isEnglish ? 'Ukrainian' : 'English'} language`}
    >
      <motion.div
        className="language-toggle-content"
        animate={{
          backgroundColor: isEnglish ? '#4f46e5' : '#fbbf24'
        }}
        transition={{ duration: 0.3 }}
      >
        <FaGlobe className="language-icon" />
        <motion.span
          className="language-text"
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isEnglish ? 'EN' : 'UK'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

export default LanguageToggle;
