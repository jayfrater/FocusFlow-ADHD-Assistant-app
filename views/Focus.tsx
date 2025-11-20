import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';

interface FocusProps {
  tasks: Task[];
}

const Focus: React.FC<FocusProps> = ({ tasks }) => {
  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  // Find active task details
  const activeTask = tasks.find(t => t.id === activeTaskId);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
      setMode(newMode);
      setIsActive(false);
      setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound?
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-calm-900">Focus Mode</h2>
        <p className="text-calm-500">One thing at a time.</p>
      </div>

      {/* Task Selector */}
      <div className="w-full mb-10">
          <label className="block text-sm font-bold text-calm-600 mb-2">I am working on:</label>
          <select 
            value={activeTaskId} 
            onChange={(e) => setActiveTaskId(e.target.value)}
            className="w-full p-4 rounded-xl border border-calm-300 bg-white shadow-sm focus:ring-2 focus:ring-focus focus:outline-none text-lg"
          >
              <option value="">-- Select a Task --</option>
              {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
              ))}
          </select>
      </div>

      {/* Timer Display */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 mb-10">
          {/* SVG Circle Progress */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
                cx="50%" cy="50%" r="45%"
                stroke="#e2e8f0" strokeWidth="15" fill="none"
            />
            <circle
                cx="50%" cy="50%" r="45%"
                stroke={mode === 'work' ? '#3b82f6' : '#10b981'} 
                strokeWidth="15" fill="none"
                strokeDasharray={2.83 * 100} // Approximation for r=45% in 100-scale viewbox-ish
                strokeDashoffset={2.83 * (100 - progress)} // This is rough math for responsive SVG, better to use fixed pixel math if rigorous
                style={{ transition: 'stroke-dashoffset 1s linear', strokeDasharray: 'calc(2 * 3.14159 * 45%)' }}
                strokeLinecap="round"
            />
            {/* Correcting strokeDashLogic for % based SVG */}
             <circle
                cx="50%" cy="50%" r="45%"
                stroke={mode === 'work' ? '#3b82f6' : '#10b981'}
                strokeWidth="15"
                fill="none"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
                strokeLinecap="round"
             />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl md:text-8xl font-mono font-bold ${mode === 'work' ? 'text-calm-800' : 'text-green-600'}`}>
                  {formatTime(timeLeft)}
              </span>
              <span className="uppercase tracking-widest text-calm-400 font-bold mt-2">
                  {mode === 'work' ? 'Focus' : 'Break'}
              </span>
          </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full bg-calm-800 hover:bg-calm-900 text-white flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
              <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button 
            onClick={resetTimer}
            className="w-20 h-20 rounded-full bg-calm-200 hover:bg-calm-300 text-calm-700 flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
              <i className="fa-solid fa-rotate-right"></i>
          </button>
      </div>

      <div className="mt-8 flex gap-4">
          <button 
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'work' ? 'bg-focus text-white' : 'bg-white text-calm-500 border'}`}
          >
              Work (25m)
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'break' ? 'bg-action text-white' : 'bg-white text-calm-500 border'}`}
          >
              Break (5m)
          </button>
      </div>
    </div>
  );
};

export default Focus;