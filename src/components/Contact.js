import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaMapMarkerAlt, FaLinkedin, 
  FaGithub, FaDownload, FaPaperPlane, FaCheck, FaTimes
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Using EmailJS for form submission
      const emailData = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Bohdan'
      };

      // Simulate API call (replace with actual EmailJS integration)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'bogdyn6@gmail.com',
      link: 'mailto:bogdyn6@gmail.com',
      color: '#ef4444'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: 'Glasgow, UK',
      link: null,
      color: '#3b82f6'
    },
    {
      icon: FaLinkedin,
      title: 'LinkedIn',
      value: 'linkedin.com/in/bohdan-developer',
      link: 'https://linkedin.com/in/bohdan-developer',
      color: '#0077b5'
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      value: 'github.com/Bogdusik',
      link: 'https://github.com/Bogdusik',
      color: '#333'
    }
  ];

  const skills = [
    'Full-Stack Development',
    'React & JavaScript',
    'Spring Boot & Java',
    'Database Design',
    'Cyber Security',
    'API Integration',
    'Problem Solving',
    'Team Collaboration'
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Ready to discuss opportunities or collaborate on exciting projects?
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="info-card">
              <h3>Let's Connect</h3>
              <p>
                I'm always interested in new opportunities, whether it's a full-time position, 
                freelance project, or just a friendly chat about technology and development.
              </p>
              
              <div className="contact-details">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      key={index}
                      href={info.link}
                      target={info.link ? '_blank' : undefined}
                      rel={info.link ? 'noopener noreferrer' : undefined}
                      className="contact-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <Icon 
                        className="contact-icon" 
                        style={{ color: info.color }}
                      />
                      <div className="contact-text">
                        <span className="contact-title">{info.title}</span>
                        <span className="contact-value">{info.value}</span>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              <motion.div
                className="cv-download"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <a href="/cv.pdf" download className="download-btn">
                  <FaDownload />
                  Download CV
                </a>
              </motion.div>
            </div>

            <div className="skills-card">
              <h3>What I Bring</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="skill-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="form-card">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    className="submit-status success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaCheck />
                    Message sent successfully!
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    className="submit-status error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaTimes />
                    Failed to send message. Please try again.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="contact-footer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>
            Thank you for visiting my portfolio! I'm excited about the possibility 
            of working together and contributing to innovative projects.
          </p>
          <div className="footer-links">
            <a href="https://github.com/Bogdusik" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/bohdan-developer" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:bogdyn6@gmail.com">
              <FaEnvelope />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
