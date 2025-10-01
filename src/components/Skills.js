import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, FaJava, FaPython, FaJs, FaHtml5, FaCss3Alt, 
  FaDatabase, FaAws, FaDocker, FaGitAlt, FaJenkins, FaNodeJs,
  FaShieldAlt, FaLock, FaNetworkWired, FaBug, FaChartLine
} from 'react-icons/fa';
import './Skills.css';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('programming');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillCategories = {
    programming: {
      title: 'Programming Languages',
      icon: FaJs,
      color: '#4f46e5',
      skills: [
        { name: 'JavaScript', level: 90, icon: FaJs, color: '#f7df1e' },
        { name: 'Java', level: 85, icon: FaJava, color: '#ed8b00' },
        { name: 'Python', level: 80, icon: FaPython, color: '#3776ab' },
        { name: 'HTML5', level: 95, icon: FaHtml5, color: '#e34f26' },
        { name: 'CSS3', level: 90, icon: FaCss3Alt, color: '#1572b6' },
        { name: 'SQL', level: 85, icon: FaDatabase, color: '#336791' }
      ]
    },
    frameworks: {
      title: 'Frameworks & Libraries',
      icon: FaReact,
      color: '#8b5cf6',
      skills: [
        { name: 'React', level: 90, icon: FaReact, color: '#61dafb' },
        { name: 'Spring Boot', level: 85, icon: FaJava, color: '#6db33f' },
        { name: '.NET', level: 80, icon: FaNodeJs, color: '#512bd4' },
        { name: 'Node.js', level: 75, icon: FaNodeJs, color: '#339933' }
      ]
    },
    tools: {
      title: 'Tools & Technologies',
      icon: FaGitAlt,
      color: '#f59e0b',
      skills: [
        { name: 'Git', level: 90, icon: FaGitAlt, color: '#f05032' },
        { name: 'Docker', level: 80, icon: FaDocker, color: '#2496ed' },
        { name: 'Jenkins', level: 75, icon: FaJenkins, color: '#d24939' },
        { name: 'AWS', level: 70, icon: FaAws, color: '#ff9900' },
        { name: 'WebSocket', level: 85, icon: FaNetworkWired, color: '#4f46e5' },
        { name: 'JFreeChart', level: 80, icon: FaChartLine, color: '#8b5cf6' }
      ]
    },
    databases: {
      title: 'Databases',
      icon: FaDatabase,
      color: '#10b981',
      skills: [
        { name: 'PostgreSQL', level: 90, icon: FaDatabase, color: '#336791' },
        { name: 'MySQL', level: 85, icon: FaDatabase, color: '#4479a1' }
      ]
    },
    security: {
      title: 'Cyber Security',
      icon: FaShieldAlt,
      color: '#ef4444',
      skills: [
        { name: 'Security Analysis', level: 85, icon: FaShieldAlt, color: '#ef4444' },
        { name: 'Vulnerability Assessment', level: 80, icon: FaLock, color: '#dc2626' },
        { name: 'Network Security', level: 75, icon: FaNetworkWired, color: '#7c3aed' },
        { name: 'Penetration Testing', level: 70, icon: FaBug, color: '#f59e0b' }
      ]
    }
  };

  const knowledgeAreas = [
    { name: 'Software Engineering', level: 90, description: 'Design patterns, architecture, best practices' },
    { name: 'Algorithms & Data Structures', level: 85, description: 'Problem-solving, optimization, complexity analysis' },
    { name: 'Cyber Security', level: 80, description: 'Security principles, threat analysis, protection mechanisms' },
    { name: 'Networking', level: 75, description: 'Network protocols, security, communication systems' },
    { name: 'Software Testing', level: 80, description: 'Unit testing, integration testing, quality assurance' },
    { name: 'API Integration', level: 85, description: 'REST APIs, external services, data processing' },
    { name: 'Big Data Analysis', level: 70, description: 'Data processing, insights, visualization' }
  ];

  const projects = [
    {
      title: 'Real-time Chat Application',
      technologies: ['Spring Boot', 'WebSocket (STOMP)', 'React', 'PostgreSQL'],
      description: 'Full-featured chat application with instant messaging and responsive interface',
      complexity: 90
    },
    {
      title: 'CryptoChatTApp',
      technologies: ['Java', 'CoinMarketCap API', 'JFreeChart'],
      description: 'Desktop application for real-time cryptocurrency price visualization',
      complexity: 80
    },
    {
      title: 'CoderType - Speed Typing Game',
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      description: 'Interactive game with performance metrics and replay functionality',
      complexity: 75
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">
            A comprehensive overview of my technical expertise and capabilities
          </p>
        </motion.div>

        <div className="skills-content">
          {/* Skill Categories */}
          <motion.div
            className="skill-categories"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="category-tabs">
              {Object.entries(skillCategories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={key}
                    className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => setActiveCategory(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ '--category-color': category.color }}
                  >
                    <Icon className="tab-icon" />
                    <span>{category.title}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="skills-grid">
              {skillCategories[activeCategory].skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    className="skill-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  >
                    <div className="skill-header">
                      <Icon 
                        className="skill-icon" 
                        style={{ color: skill.color }}
                      />
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <div className="skill-level">
                      <div className="level-bar">
                        <motion.div
                          className="level-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          style={{ backgroundColor: skill.color }}
                        />
                      </div>
                      <span className="level-percentage">{skill.level}%</span>
                    </div>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        className="skill-tooltip"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {skill.name} - {skill.level}% proficiency
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Knowledge Areas */}
          <motion.div
            className="knowledge-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="subsection-title">Knowledge Areas</h3>
            <div className="knowledge-grid">
              {knowledgeAreas.map((area, index) => (
                <motion.div
                  key={area.name}
                  className="knowledge-card"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                >
                  <div className="knowledge-header">
                    <h4>{area.name}</h4>
                    <span className="knowledge-level">{area.level}%</span>
                  </div>
                  <p className="knowledge-description">{area.description}</p>
                  <div className="knowledge-bar">
                    <motion.div
                      className="knowledge-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${area.level}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Project Complexity */}
          <motion.div
            className="projects-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="subsection-title">Project Complexity & Technologies</h3>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  className="project-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <div className="complexity-indicator">
                      <span>Complexity: {project.complexity}%</span>
                      <div className="complexity-bar">
                        <motion.div
                          className="complexity-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.complexity}%` }}
                          transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="technologies-used">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="tech-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.2 + techIndex * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
