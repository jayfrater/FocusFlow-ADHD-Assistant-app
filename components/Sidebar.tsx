import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-line' },
    { id: ViewState.PROJECTS, label: 'Projects & Tasks', icon: 'fa-layer-group' },
    { id: ViewState.BRAIN_DUMP, label: 'Brain Dump', icon: 'fa-brain' },
    { id: ViewState.FOCUS, label: 'Focus Mode', icon: 'fa-stopwatch' },
    { id: ViewState.CHAT, label: 'Assistant', icon: 'fa-robot' },
  ];

  return (
    <div className="w-20 md:w-64 bg-calm-800 text-white flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-calm-700">
        <div className="w-8 h-8 bg-action rounded-lg flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bolt text-white"></i>
        </div>
        <h1 className="text-xl font-bold hidden md:block tracking-tight">FocusFlow</h1>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-focus text-white shadow-lg shadow-focus/20 translate-x-1' 
                : 'text-calm-300 hover:bg-calm-700 hover:text-white'
              }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center text-lg transition-transform group-hover:scale-110`}></i>
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-calm-700">
        <div className="bg-calm-700/50 rounded-lg p-3 hidden md:block">
            <p className="text-xs text-calm-400 uppercase font-bold mb-1">Tip</p>
            <p className="text-sm text-calm-200 italic">"Don't let perfect be the enemy of done."</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;