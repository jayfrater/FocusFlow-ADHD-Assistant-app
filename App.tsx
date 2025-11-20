import React, { useState } from 'react';
import { ViewState, Task, AppState } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Projects from './views/Projects';
import Focus from './views/Focus';
import BrainDump from './views/BrainDump';
import Chat from './views/Chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  // In a real app, this would be persisted to localStorage or a database
  const [tasks, setTasks] = useState<Task[]>([]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard tasks={tasks} onChangeView={setCurrentView} />;
      case ViewState.PROJECTS:
        return <Projects tasks={tasks} setTasks={setTasks} />;
      case ViewState.FOCUS:
        return <Focus tasks={tasks} />;
      case ViewState.BRAIN_DUMP:
        return <BrainDump setTasks={setTasks} onChangeView={setCurrentView} />;
      case ViewState.CHAT:
        return <Chat />;
      default:
        return <Dashboard tasks={tasks} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-calm-50 font-sans text-calm-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 relative overflow-hidden h-screen overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;