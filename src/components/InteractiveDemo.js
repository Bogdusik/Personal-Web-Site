import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaRedo, FaCode, FaTrophy, FaClock, 
  FaCheck, FaTimes, FaKeyboard, FaRocket, FaStar
} from 'react-icons/fa';
import './InteractiveDemo.css';

const InteractiveDemo = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentCode, setCurrentCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('typing');
  
  const textareaRef = useRef(null);
  const intervalRef = useRef(null);

  const codeSnippets = {
    easy: [
      `function greet(name) {
  return "Hello, " + name + "!";
}`,
      `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);`,
      `if (user.isLoggedIn) {
  showDashboard();
} else {
  showLogin();
}`
    ],
    medium: [
      `class UserService {
  constructor(database) {
    this.db = database;
  }
  
  async createUser(userData) {
    const user = await this.db.users.create(userData);
    return user;
  }
}`,
      `const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});`,
      `useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  };
  
  fetchData();
}, []);`
    ],
    hard: [
      `const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => setMessage(event.data);
    
    return () => ws.close();
  }, [url]);
  
  return { socket, message };
};`,
      `const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
};`
    ]
  };

  const algorithmChallenges = [
    {
      title: "Two Sum Problem",
      description: "Find two numbers in an array that add up to a target value",
      solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]" },
        { input: "[3,2,4], 6", expected: "[1,2]" },
        { input: "[3,3], 6", expected: "[0,1]" }
      ]
    },
    {
      title: "Valid Parentheses",
      description: "Check if a string has valid parentheses",
      solution: `function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (let char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else if (stack.length === 0 || pairs[stack.pop()] !== char) {
      return false;
    }
  }
  
  return stack.length === 0;
}`,
      testCases: [
        { input: "()", expected: "true" },
        { input: "()[]{}", expected: "true" },
        { input: "(]", expected: "false" }
      ]
    }
  ];

  const startGame = () => {
    const snippets = codeSnippets[difficulty];
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    setTargetCode(randomSnippet);
    setCurrentCode('');
    setCurrentCharIndex(0);
    setTimeLeft(60);
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setErrors(0);
    setGameState('playing');
    setIsPlaying(true);
    setStartTime(Date.now());
    setShowResults(false);
    
    if (gameMode === 'typing') {
      setTargetCode(randomSnippet);
    } else {
      const challenge = algorithmChallenges[Math.floor(Math.random() * algorithmChallenges.length)];
      setTargetCode(challenge.solution);
    }
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      clearInterval(intervalRef.current);
    } else {
      startTimer();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    setCurrentCode('');
    setTargetCode('');
    setTimeLeft(60);
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setCurrentCharIndex(0);
    setErrors(0);
    setShowResults(false);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishGame = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    setGameState('finished');
    setShowResults(true);
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = currentCode.split(' ').length;
    const calculatedWpm = Math.round(wordsTyped / timeElapsed);
    setWpm(calculatedWpm);
    
    const totalChars = targetCode.length;
    const correctChars = totalChars - errors;
    const calculatedAccuracy = Math.round((correctChars / totalChars) * 100);
    setAccuracy(calculatedAccuracy);
    
    const calculatedScore = Math.round((calculatedWpm * calculatedAccuracy) / 100);
    setScore(calculatedScore);
  };

  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      startTimer();
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, gameState]);

  const handleCodeChange = (e) => {
    if (!isPlaying || gameState !== 'playing') return;
    
    const value = e.target.value;
    setCurrentCode(value);
    
    // Check for errors
    let newErrors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== targetCode[i]) {
        newErrors++;
      }
    }
    setErrors(newErrors);
    
    // Update character index
    setCurrentCharIndex(value.length);
    
    // Check if completed
    if (value === targetCode) {
      finishGame();
    }
  };

  const getCharClass = (index) => {
    if (index < currentCode.length) {
      return currentCode[index] === targetCode[index] ? 'correct' : 'incorrect';
    }
    if (index === currentCode.length) {
      return 'current';
    }
    return '';
  };

  const getPerformanceLevel = () => {
    if (wpm >= 60 && accuracy >= 95) return { level: 'Expert', color: '#10b981', icon: FaRocket };
    if (wpm >= 40 && accuracy >= 90) return { level: 'Advanced', color: '#3b82f6', icon: FaStar };
    if (wpm >= 20 && accuracy >= 80) return { level: 'Intermediate', color: '#f59e0b', icon: FaTrophy };
    return { level: 'Beginner', color: '#ef4444', icon: FaKeyboard };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <section id="demo" className="interactive-demo">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Interactive Coding Challenge</h2>
          <p className="section-subtitle">
            Test your programming skills with real coding challenges and typing speed tests
          </p>
        </motion.div>

        <div className="demo-content">
          {gameState === 'menu' && (
            <motion.div
              className="game-menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="menu-card">
                <h3>Choose Your Challenge</h3>
                
                <div className="game-modes">
                  <div className="mode-selection">
                    <h4>Game Mode</h4>
                    <div className="mode-buttons">
                      <button
                        className={`mode-btn ${gameMode === 'typing' ? 'active' : ''}`}
                        onClick={() => setGameMode('typing')}
                      >
                        <FaKeyboard />
                        Speed Typing
                      </button>
                      <button
                        className={`mode-btn ${gameMode === 'algorithm' ? 'active' : ''}`}
                        onClick={() => setGameMode('algorithm')}
                      >
                        <FaCode />
                        Algorithm Challenge
                      </button>
                    </div>
                  </div>

                  <div className="difficulty-selection">
                    <h4>Difficulty</h4>
                    <div className="difficulty-buttons">
                      {['easy', 'medium', 'hard'].map((diff) => (
                        <button
                          key={diff}
                          className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                          onClick={() => setDifficulty(diff)}
                        >
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  className="start-btn"
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay />
                  Start Challenge
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              className="game-area"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-header">
                <div className="game-stats">
                  <div className="stat">
                    <FaClock />
                    <span>{timeLeft}s</span>
                  </div>
                  <div className="stat">
                    <FaTrophy />
                    <span>{score}</span>
                  </div>
                  <div className="stat">
                    <span>WPM: {wpm}</span>
                  </div>
                  <div className="stat">
                    <span>Accuracy: {accuracy}%</span>
                  </div>
                </div>
                
                <div className="game-controls">
                  <button onClick={pauseGame} className="control-btn">
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={resetGame} className="control-btn">
                    <FaRedo />
                  </button>
                </div>
              </div>

              <div className="code-display">
                <div className="code-container">
                  {targetCode.split('').map((char, index) => (
                    <span
                      key={index}
                      className={`code-char ${getCharClass(index)}`}
                    >
                      {char === '\n' ? '↵' : char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="input-area">
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={handleCodeChange}
                  placeholder="Start typing here..."
                  className="code-input"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div
              className="results-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="results-card">
                <div className="results-header">
                  <PerformanceIcon 
                    className="performance-icon" 
                    style={{ color: performance.color }}
                  />
                  <h3>Challenge Complete!</h3>
                  <div className="performance-level" style={{ color: performance.color }}>
                    {performance.level}
                  </div>
                </div>

                <div className="results-stats">
                  <div className="result-stat">
                    <FaTrophy />
                    <div>
                      <span className="stat-value">{score}</span>
                      <span className="stat-label">Score</span>
                    </div>
                  </div>
                  <div className="result-stat">
                    <FaKeyboard />
                    <div>
                      <span className="stat-value">{wpm}</span>
                      <span className="stat-label">WPM</span>
                    </div>
                  </div>
                  <div className="result-stat">
                    <FaCheck />
                    <div>
                      <span className="stat-value">{accuracy}%</span>
                      <span className="stat-label">Accuracy</span>
                    </div>
                  </div>
                  <div className="result-stat">
                    <FaTimes />
                    <div>
                      <span className="stat-value">{errors}</span>
                      <span className="stat-label">Errors</span>
                    </div>
                  </div>
                </div>

                <div className="results-actions">
                  <button onClick={startGame} className="action-btn primary">
                    <FaPlay />
                    Try Again
                  </button>
                  <button onClick={resetGame} className="action-btn secondary">
                    <FaRedo />
                    New Challenge
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
