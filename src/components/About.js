import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaAward, FaLanguage, FaCar, FaGamepad, FaMusic, FaLaptop } from 'react-icons/fa';
import './About.css';

const About = () => {
  const education = [
    {
      institution: "Glasgow Caledonian University",
      degree: "Computing",
      period: "September 2023 – Present",
      location: "Glasgow, UK",
      description: "Pursuing comprehensive studies in Computer Science, Software Engineering, and Cyber Security"
    },
    {
      institution: "Dumfries and Galloway College",
      degree: "Cyber Security",
      period: "Completed",
      location: "Dumfries, UK",
      description: "Comprehensive analysis of cybersecurity principles and practical application in system protection"
    },
    {
      institution: "National Aerospace University 'KHAI'",
      degree: "Junior Bachelor's in Software Engineering",
      period: "Completed",
      location: "Ukraine",
      description: "Focused on efficient algorithms, .NET development, and secure software architecture"
    }
  ];

  const certificates = [
    "Higher National Certificate in Cyber Security (June 2023)",
    "Cisco Networking Academy - Networking Essentials (June 2023)",
    "Junior Bachelor's of Software Engineering (June 2023)",
    "Full UK Driving Licence (September 2024)"
  ];

  const languages = [
    { name: "English", level: "Upper Intermediate", flag: "🇬🇧" },
    { name: "Ukrainian", level: "Native", flag: "🇺🇦" },
    { name: "Russian", level: "Native", flag: "🇷🇺" }
  ];

  const interests = [
    { name: "Cars", icon: FaCar, color: "#ff6b6b" },
    { name: "Technology", icon: FaLaptop, color: "#4ecdc4" },
    { name: "Video Games", icon: FaGamepad, color: "#45b7d1" },
    { name: "Music", icon: FaMusic, color: "#96ceb4" },
    { name: "PC Building", icon: FaLaptop, color: "#feca57" }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A motivated Computing student passionate about creating innovative solutions
          </p>
        </motion.div>

        <div className="about-content">
        <motion.div
          className="about-intro"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 1.0, 
            delay: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
            <div className="intro-card">
              <h3>My Story</h3>
              <p>
                I'm a passionate Computing student with a strong foundation in Computer Science, 
                Software Engineering, and Cyber Security. My journey spans from Ukraine to the UK, 
                where I've developed expertise in full-stack development, desktop applications, 
                and secure, scalable solutions.
              </p>
              <p>
                I thrive on solving complex problems and creating innovative applications that 
                make a real difference. My experience ranges from real-time chat applications 
                to cryptocurrency analysis tools, always with a focus on security and user experience.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="education-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="subsection-title">
              <FaGraduationCap className="title-icon" />
              Education
            </h3>
            <div className="education-timeline">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="education-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="education-content">
                    <h4>{edu.institution}</h4>
                    <p className="degree">{edu.degree}</p>
                    <p className="period">{edu.period} • {edu.location}</p>
                    <p className="description">{edu.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="certificates-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="subsection-title">
              <FaAward className="title-icon" />
              Certificates & Achievements
            </h3>
            <div className="certificates-grid">
              {certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  className="certificate-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <FaAward className="certificate-icon" />
                  <span>{cert}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="bottom-sections">
            <motion.div
              className="languages-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="subsection-title">
                <FaLanguage className="title-icon" />
                Languages
              </h3>
              <div className="languages-list">
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    className="language-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  >
                    <span className="flag">{lang.flag}</span>
                    <div className="language-info">
                      <span className="language-name">{lang.name}</span>
                      <span className="language-level">{lang.level}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="interests-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <h3 className="subsection-title">Interests</h3>
              <div className="interests-grid">
                {interests.map((interest, index) => {
                  const Icon = interest.icon;
                  return (
                    <motion.div
                      key={index}
                      className="interest-item"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      style={{ '--interest-color': interest.color }}
                    >
                      <Icon className="interest-icon" />
                      <span>{interest.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
