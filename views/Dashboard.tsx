import React from 'react';
import { Task, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  onChangeView: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onChangeView }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE).length;
  const highPriority = tasks.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

  const data = [
    { name: 'Done', value: completedTasks, color: '#10b981' },
    { name: 'To Do', value: pendingTasks, color: '#3b82f6' },
    { name: 'High Pri', value: highPriority, color: '#f43f5e' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-calm-900">Good Morning, Engineer.</h2>
        <p className="text-calm-500 mt-2">Ready to eat the elephant one bite at a time?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-calm-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-check"></i>
          </div>
          <div>
            <p className="text-calm-500 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-calm-900">{completedTasks}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-calm-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-list-check"></i>
          </div>
          <div>
            <p className="text-calm-500 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-calm-900">{pendingTasks}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-calm-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-fire"></i>
          </div>
          <div>
            <p className="text-calm-500 text-sm font-medium">High Priority</p>
            <p className="text-2xl font-bold text-calm-900">{highPriority}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-calm-200 h-80">
            <h3 className="text-lg font-semibold text-calm-800 mb-4">Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-calm-800 to-calm-900 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
           <div>
               <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
               <p className="text-calm-300 text-sm mb-6">Don't overthink it. Pick a path.</p>
           </div>
           
           <div className="grid grid-cols-1 gap-3">
               <button 
                onClick={() => onChangeView('brain_dump')}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl text-left flex items-center gap-3 transition-colors"
               >
                   <i className="fa-solid fa-brain text-yellow-400"></i>
                   <span className="font-medium">Empty my brain (Brain Dump)</span>
               </button>

               <button 
                onClick={() => onChangeView('projects')}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl text-left flex items-center gap-3 transition-colors"
               >
                   <i className="fa-solid fa-magic text-purple-400"></i>
                   <span className="font-medium">Break down a scary project</span>
               </button>

               <button 
                onClick={() => onChangeView('focus')}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl text-left flex items-center gap-3 transition-colors"
               >
                   <i className="fa-solid fa-play text-green-400"></i>
                   <span className="font-medium">Start Focus Timer</span>
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;