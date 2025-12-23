import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaExternalLinkAlt, FaCode, FaDatabase, 
  FaRocket, FaShieldAlt, FaChartLine, FaComments,
  FaJava, FaReact, FaJs, FaPython, FaAws, FaDocker
} from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'Programming Helper AI',
      category: 'AI-powered Learning Platform',
      description: 'AI assistant for learning and practicing coding with guided explanations, code suggestions, and progress tracking.',
      longDescription: 'Built an AI-powered web app that helps learners understand programming concepts faster through real-time explanations, contextual code suggestions, and structured practice tasks. Designed a scalable Next.js architecture with secure authentication and analytics to keep users engaged.',
      technologies: [
        { name: 'Next.js', icon: FaReact, color: '#61dafb' },
        { name: 'TypeScript', icon: FaJs, color: '#3178c6' },
        { name: 'Tailwind CSS', icon: FaCode, color: '#38bdf8' },
        { name: 'OpenAI API', icon: FaRocket, color: '#8b5cf6' }
      ],
      features: [
        'AI chat with real-time code explanations',
        'Guided tasks with hints and solutions',
        'Progress tracking and analytics',
        'Secure authentication with Clerk',
        'Responsive UI with Tailwind and Framer Motion',
        'Deployment-ready on Vercel'
      ],
      challenges: [
        'Balancing API cost with latency for AI calls',
        'Keeping context relevant across chat sessions',
        'Designing UI that works across devices'
      ],
      solutions: [
        'Implemented request throttling and caching',
        'Conversation state managed per session with guards',
        'Responsive layout with reusable components and motion'
      ],
      github: 'https://github.com/bogdusik/programming-helper-ai',
      demo: 'https://programming-helper-ai.vercel.app',
      image: 'https://images.unsplash.com/photo-1537432376769-00a4c8399f66?w=800&h=520&fit=crop&crop=center',
      complexity: 92,
      duration: '4 months'
    },
    {
      id: 2,
      title: 'Real-time Chat Application',
      category: 'Full-Stack Development',
      description: 'A comprehensive chat application built with Spring Boot and React, featuring real-time messaging, user authentication, and responsive design.',
      longDescription: 'Developed a full-featured chat application with instant messaging capabilities, structured database management, and a responsive interface. The application ensures seamless user experience with WebSocket (STOMP) for real-time communication and PostgreSQL for reliable data storage.',
      technologies: [
        { name: 'Spring Boot', icon: FaJava, color: '#6db33f' },
        { name: 'React', icon: FaReact, color: '#61dafb' },
        { name: 'PostgreSQL', icon: FaDatabase, color: '#336791' },
        { name: 'WebSocket', icon: FaComments, color: '#4f46e5' }
      ],
      features: [
        'Real-time messaging with WebSocket (STOMP)',
        'User authentication and authorization',
        'Responsive React frontend',
        'PostgreSQL database integration',
        'Message history and persistence',
        'User presence indicators'
      ],
      challenges: [
        'Implementing real-time communication',
        'Managing WebSocket connections',
        'Database optimization for chat data',
        'Creating responsive UI components'
      ],
      solutions: [
        'Used STOMP protocol for reliable messaging',
        'Implemented connection management',
        'Optimized database queries and indexing',
        'Built reusable React components'
      ],
      github: 'https://github.com/Bogdusik/Real-Time-Chat-Application',
      demo: 'https://github.com/Bogdusik/Real-Time-Chat-Application',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center',
      complexity: 90,
      duration: '3 months'
    },
    {
      id: 3,
      title: 'CryptoChartApp',
      category: 'Desktop Application',
      description: 'A desktop application for real-time cryptocurrency price tracking and visualization using Java and external APIs.',
      longDescription: 'Created a desktop application to retrieve and visualize real-time cryptocurrency prices using interactive charts. The application demonstrates skills in external API integration, data processing, and desktop application development with Java.',
      technologies: [
        { name: 'Java', icon: FaJava, color: '#ed8b00' },
        { name: 'CoinMarketCap API', icon: FaChartLine, color: '#f59e0b' },
        { name: 'JFreeChart', icon: FaChartLine, color: '#8b5cf6' }
      ],
      features: [
        'Real-time cryptocurrency price tracking',
        'Interactive charts and graphs',
        'Multiple cryptocurrency support',
        'Price alerts and notifications',
        'Historical data analysis',
        'Export functionality'
      ],
      challenges: [
        'API rate limiting and handling',
        'Real-time data updates',
        'Chart performance optimization',
        'Desktop application packaging'
      ],
      solutions: [
        'Implemented efficient API caching',
        'Used threading for real-time updates',
        'Optimized chart rendering',
        'Created executable JAR files'
      ],
      github: 'https://github.com/Bogdusik/CryptoChartApp',
      demo: null,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&crop=center',
      complexity: 80,
      duration: '2 months'
    }
  ];

  const achievements = [
    {
      title: 'Security Enhancement',
      description: 'Identified and remediated two significant security vulnerabilities pre-deployment',
      icon: FaShieldAlt,
      color: '#ef4444'
    },
    {
      title: 'Performance Optimization',
      description: 'Improved application performance by 40% through database optimization',
      icon: FaRocket,
      color: '#10b981'
    },
    {
      title: 'User Engagement',
      description: 'Increased event participation by 50+ additional participants through digital outreach',
      icon: FaChartLine,
      color: '#8b5cf6'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Showcasing my technical skills through real-world applications and solutions
          </p>
        </motion.div>

        <div className="projects-content">
          {/* Project Navigation */}
          <motion.div
            className="project-navigation"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                className={`project-nav-item ${activeProject === index ? 'active' : ''}`}
                onClick={() => setActiveProject(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <span className="nav-number">{index + 1}</span>
                <div className="nav-content">
                  <h4>{project.title}</h4>
                  <p>{project.category}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Active Project Display */}
          <motion.div
            className="project-display"
            key={activeProject}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="project-main">
              <div className="project-info">
                <motion.div
                  className="project-header"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3>{projects[activeProject].title}</h3>
                  <div className="project-meta">
                    <span className="category">{projects[activeProject].category}</span>
                    <span className="complexity">Complexity: {projects[activeProject].complexity}%</span>
                    <span className="duration">Duration: {projects[activeProject].duration}</span>
                  </div>
                </motion.div>

                <motion.p
                  className="project-description"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {projects[activeProject].longDescription}
                </motion.p>

                <motion.div
                  className="project-technologies"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h4>Technologies Used</h4>
                  <div className="tech-grid">
                    {projects[activeProject].technologies.map((tech, index) => {
                      const Icon = tech.icon;
                      return (
                        <motion.div
                          key={tech.name}
                          className="tech-item"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="tech-icon" style={{ color: tech.color }} />
                          <span>{tech.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  className="project-actions"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.a
                    href={projects[activeProject].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn primary"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub />
                    View Code
                  </motion.a>
                  {projects[activeProject].demo && (
                    <motion.a
                      href={projects[activeProject].demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn secondary"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt />
                      Live Demo
                    </motion.a>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="project-visual"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="project-image">
                  {projects[activeProject].title === 'Programming Helper AI' ? (
                    <iframe
                      src="https://programming-helper-ai.vercel.app"
                      className="project-iframe"
                      title="Programming Helper AI"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : projects[activeProject].title === 'CoderType - Speed Typing Game' ? (
                    <iframe
                      src="https://coder-type-bogdus1k.vercel.app"
                      className="project-iframe"
                      title="CoderType Game"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <img 
                      src={projects[activeProject].image} 
                      alt={`${projects[activeProject].title} Screenshot`}
                      className="project-screenshot"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  <div className="image-placeholder" style={{ display: 'none' }}>
                    <FaCode className="placeholder-icon" />
                    <span>Project Screenshot</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Project Details */}
            <motion.div
              className="project-details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="details-grid">
                <div className="detail-section">
                  <h4>Key Features</h4>
                  <ul className="feature-list">
                    {projects[activeProject].features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Challenges & Solutions</h4>
                  <div className="challenge-solution">
                    <div className="challenges">
                      <h5>Challenges</h5>
                      <ul>
                        {projects[activeProject].challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="solutions">
                      <h5>Solutions</h5>
                      <ul>
                        {projects[activeProject].solutions.map((solution, index) => (
                          <li key={index}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            className="achievements-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="subsection-title">Key Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    className="achievement-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Icon className="achievement-icon" style={{ color: achievement.color }} />
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
