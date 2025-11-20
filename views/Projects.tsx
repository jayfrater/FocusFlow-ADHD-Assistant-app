import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../types';
import { generateTaskBreakdown } from '../services/geminiService';

interface ProjectsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Projects: React.FC<ProjectsProps> = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    setIsLoading(true);
    
    try {
        // 1. Create the main parent task
        const parentTask: Task = {
            id: Date.now().toString(),
            title: newProjectTitle,
            description: newProjectDesc,
            priority: Priority.MEDIUM,
            status: TaskStatus.TODO,
            subTasks: [],
            createdAt: Date.now(),
            tags: ['Project']
        };

        // 2. Call AI to generate subtasks
        const breakdown = await generateTaskBreakdown(newProjectTitle, newProjectDesc);
        
        const subTasks = breakdown.map((step, idx) => ({
            id: `${parentTask.id}-sub-${idx}`,
            title: step.title,
            estimatedMinutes: step.estimatedMinutes,
            isCompleted: false
        }));

        parentTask.subTasks = subTasks;

        setTasks(prev => [parentTask, ...prev]);
        setIsModalOpen(false);
        setNewProjectTitle('');
        setNewProjectDesc('');
    } catch (err) {
        alert("Failed to generate breakdown. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(task => {
        if (task.id !== taskId) return task;
        const newSubTasks = task.subTasks.map(st => {
            if (st.id === subTaskId) return { ...st, isCompleted: !st.isCompleted };
            return st;
        });
        
        // Auto-update parent status if all subs are done
        const allDone = newSubTasks.every(st => st.isCompleted);
        return {
            ...task,
            subTasks: newSubTasks,
            status: allDone ? TaskStatus.DONE : TaskStatus.IN_PROGRESS
        };
    }));
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-calm-900">Projects</h2>
            <p className="text-calm-500">Break big things into small things.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-focus hover:bg-focus-dark text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-focus/30 transition-all flex items-center gap-2"
        >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Breakdown</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {tasks.length === 0 && (
            <div className="text-center py-20 text-calm-400">
                <i className="fa-solid fa-clipboard-check text-6xl mb-4 opacity-20"></i>
                <p>No active projects. Start by adding one!</p>
            </div>
        )}

        {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-calm-200 overflow-hidden transition-all hover:shadow-md">
                <div className="p-5 border-b border-calm-100 flex justify-between items-start bg-calm-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-bold ${task.status === TaskStatus.DONE ? 'text-calm-400 line-through' : 'text-calm-800'}`}>
                                {task.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium 
                                ${task.priority === Priority.HIGH || task.priority === Priority.CRITICAL ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {task.priority}
                            </span>
                        </div>
                        <p className="text-calm-500 text-sm">{task.description}</p>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-calm-300 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
                
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-calm-400 uppercase tracking-wider">Action Plan</span>
                        <span className="text-xs text-calm-400">
                            {task.subTasks.filter(st => st.isCompleted).length}/{task.subTasks.length} Steps
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                        {task.subTasks.map(st => (
                            <div 
                                key={st.id} 
                                onClick={() => toggleSubTask(task.id, st.id)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all
                                    ${st.isCompleted 
                                        ? 'bg-calm-50 border-transparent opacity-60' 
                                        : 'bg-white border-calm-200 hover:border-focus'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors
                                    ${st.isCompleted ? 'bg-green-500 border-green-500' : 'border-calm-300'}`}>
                                    {st.isCompleted && <i className="fa-solid fa-check text-white text-xs"></i>}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${st.isCompleted ? 'line-through text-calm-400' : 'text-calm-700'}`}>
                                        {st.title}
                                    </p>
                                </div>
                                <div className="text-xs text-calm-400 font-mono flex items-center gap-1">
                                    <i className="fa-regular fa-clock"></i>
                                    {st.estimatedMinutes}m
                                </div>
                            </div>
                        ))}
                        {task.subTasks.length === 0 && (
                            <p className="text-sm text-calm-400 italic">No subtasks defined yet.</p>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-calm-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 bg-calm-50 border-b border-calm-100">
                    <h3 className="text-xl font-bold text-calm-800">Add New Project</h3>
                    <p className="text-sm text-calm-500">Let AI generate the baby steps for you.</p>
                </div>
                <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-calm-700 mb-1">Project Title</label>
                        <input 
                            type="text" 
                            value={newProjectTitle}
                            onChange={(e) => setNewProjectTitle(e.target.value)}
                            className="w-full p-3 border border-calm-200 rounded-xl focus:ring-2 focus:ring-focus focus:outline-none"
                            placeholder="e.g., Design Bridge Foundation"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-calm-700 mb-1">Context/Details (Optional)</label>
                        <textarea 
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            className="w-full p-3 border border-calm-200 rounded-xl focus:ring-2 focus:ring-focus focus:outline-none h-24 resize-none"
                            placeholder="Give the AI some context to make better steps..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-calm-600 font-medium hover:bg-calm-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-focus hover:bg-focus-dark text-white font-medium rounded-lg shadow-lg shadow-focus/30 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    Break it Down
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;