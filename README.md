# Personal Web Site

An interactive portfolio website showcasing technical skills, projects, and achievements. Features smooth animations, particle effects, and an interactive coding challenge to demonstrate programming abilities. Built with React to create an engaging user experience that combines technical skills with creative design.

## Demo

![Hero Section](screenshots/hero.png)
![Projects Gallery](screenshots/projects.png)
![Coding Challenge](screenshots/coding-challenge.png)
![Skills Showcase](screenshots/skills.png)

## Why It's Cool

- **Interactive Particle System**: Dynamic particle background that responds to user mouse movement, creating an engaging visual experience
- **Coding Challenge Game**: Real-time typing speed test with actual code snippets, algorithm challenges, and performance metrics (WPM, accuracy)
- **Smooth Animations**: Professional 60fps animations powered by Framer Motion with scroll-triggered animations and micro-interactions
- **Modern UI/UX**: Clean design with glass morphism effects, responsive layout, and intuitive navigation optimized for all devices
- **Accessibility First**: Full keyboard navigation, screen reader support, high contrast ratios, and semantic HTML
- **Performance Optimized**: Fast loading with code splitting, hardware-accelerated animations, and mobile-optimized performance

## Tech Stack

- **Frontend**: React, JavaScript ES6+, HTML5, CSS3
- **Animation**: Framer Motion, Canvas API, CSS Animations
- **Styling**: Custom CSS with responsive design, glass morphism effects
- **Deployment**: Vercel

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bogdusik/Personal-Web-Site.git
   cd Personal-Web-Site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Application will be available at `http://localhost:3000`

   **Alternative (using script):**
   ```bash
   ./start-dev.sh
   ```

> **Note**: This is a frontend-only application. No backend or database setup required.

## Project Structure

```
Personal-Web-Site/
├── src/
│   ├── components/              # React Components
│   │   ├── Header.js           # Navigation header
│   │   ├── Hero.js             # Hero section with typing animation
│   │   ├── About.js             # About section
│   │   ├── Skills.js            # Skills showcase
│   │   ├── Projects.js          # Projects gallery
│   │   ├── InteractiveDemo.js   # Coding challenge game
│   │   ├── Contact.js            # Contact form
│   │   ├── Footer.js            # Footer component
│   │   ├── ParticleBackground.js # Particle system
│   │   └── ThemeToggle.js       # Dark/light theme toggle
│   ├── contexts/                # React Contexts
│   │   └── ThemeContext.js      # Theme management
│   ├── hooks/                   # Custom Hooks
│   │   └── useSwipeNavigation.js
│   ├── utils/                   # Utilities
│   │   └── constants.js         # App constants
│   ├── App.js                   # Main app component
│   └── index.js                 # Entry point
│
├── public/                      # Static Assets
│   ├── images/                  # Images and assets
│   ├── logo.svg                 # Logo
│   └── index.html               # HTML template
│
└── [config files]               # Configuration files
    ├── package.json
    └── .vercelignore
```

## What I Learned

- **Advanced React Patterns**: Built complex interactive components using React hooks, context API, and component composition
- **Animation Libraries**: Implemented smooth animations with Framer Motion, creating engaging user experiences with scroll-triggered animations
- **Canvas API**: Created custom particle system using HTML5 Canvas API with real-time mouse interaction and performance optimization
- **Responsive Design**: Designed mobile-first responsive layout with breakpoint optimization and touch-friendly interactions
- **Accessibility**: Implemented full keyboard navigation, ARIA labels, and semantic HTML for inclusive user experience
- **Performance Optimization**: Optimized rendering with code splitting, lazy loading, and hardware-accelerated animations for 60fps performance

Fork it, use it, improve it — open to PRs!
