import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaCode, 
  FaRocket, FaGraduationCap, FaMapMarkerAlt, FaPhone
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/bohdan',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/in/bohdan',
      color: '#0077b5'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: 'mailto:bohdan@example.com',
      color: '#ea4335'
    }
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Demo', href: '#demo' },
    { name: 'Contact', href: '#contact' }
  ];

  const skills = [
    'React', 'JavaScript', 'Java', 'Spring Boot', 
    'PostgreSQL', 'AWS', 'Cyber Security', 'Full-Stack'
  ];

  const handleLinkClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="footer-main">
          <motion.div
            className="footer-section footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="brand-info">
              <motion.div
                className="footer-logo"
                whileHover={{ scale: 1.05 }}
              >
                <FaCode className="logo-icon" />
                <span className="logo-text">Bohdan</span>
              </motion.div>
              <p className="brand-description">
                A passionate Computing student ready to bring innovative solutions 
                and technical excellence to your team.
              </p>
            </div>
            
            <div className="social-links">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{ '--social-color': social.color }}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="footer-section footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Quick Links</h3>
            <ul className="links-list">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="footer-link"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-section footer-skills"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>Core Skills</h3>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="footer-section footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3>Get In Touch</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>bohdan@example.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+44 123 456 7890</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Glasgow, UK</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                © {currentYear} Bohdan.
              </p>
            </div>
            
            <div className="footer-stats">
              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaCode className="stat-icon" />
                <span>Full-Stack Developer</span>
              </motion.div>
              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaGraduationCap className="stat-icon" />
                <span>Computing Student</span>
              </motion.div>
              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <FaRocket className="stat-icon" />
                <span>Ready to Launch</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
