import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../types';
import { organizeBrainDump } from '../services/geminiService';

interface BrainDumpProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onChangeView: (view: any) => void;
}

const BrainDump: React.FC<BrainDumpProps> = ({ setTasks, onChangeView }) => {
  const [dumpText, setDumpText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
      if (!dumpText.trim()) return;
      setIsProcessing(true);
      try {
          const organizedTasks = await organizeBrainDump(dumpText);
          
          const newTasks: Task[] = organizedTasks.map((t: any, idx: number) => ({
            id: `dump-${Date.now()}-${idx}`,
            title: t.title,
            description: t.description,
            priority: t.priority as Priority,
            status: TaskStatus.TODO,
            subTasks: [],
            createdAt: Date.now(),
            tags: ['Brain Dump']
          }));

          setTasks(prev => [...prev, ...newTasks]);
          setDumpText(''); // Clear input
          
          // Show success feedback briefly or navigate
          // For now, let's navigate to projects view to see the result
          onChangeView('projects');

      } catch (e) {
          alert('Failed to organize. Try again.');
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full flex flex-col">
       <div className="mb-6">
        <h2 className="text-3xl font-bold text-calm-900">Brain Dump</h2>
        <p className="text-calm-500">Get it all out of your head. We'll organize it later.</p>
       </div>

       <div className="flex-1 bg-white rounded-2xl shadow-sm border border-calm-200 p-2 flex flex-col">
           <textarea
            className="w-full h-full p-6 resize-none focus:outline-none text-lg text-calm-800 placeholder:text-calm-300 rounded-xl"
            placeholder="Type everything that's on your mind... 
- Need to email client X
- Buy milk
- Review the structural drawings for sector 7
- Call mom
- Fix the bug in the reporting script"
            value={dumpText}
            onChange={(e) => setDumpText(e.target.value)}
           />
           
           <div className="p-4 border-t border-calm-100 bg-calm-50 rounded-b-xl flex justify-between items-center">
               <span className="text-sm text-calm-400">
                   {dumpText.length} characters
               </span>
               <button
                onClick={handleProcess}
                disabled={!dumpText.trim() || isProcessing}
                className="bg-action hover:bg-action-hover disabled:bg-calm-300 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
               >
                   {isProcessing ? (
                       <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        Organizing...
                       </>
                   ) : (
                       <>
                        <i className="fa-solid fa-filter"></i>
                        Organize For Me
                       </>
                   )}
               </button>
           </div>
       </div>
    </div>
  );
};

export default BrainDump;