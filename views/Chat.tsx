import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'welcome',
        role: 'model',
        text: "Hi. I'm here to help you untangle your thoughts. What's stuck right now?",
        timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Convert chat history for Gemini
    const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAssistant(history, userMsg.text);

    const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm listening.",
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-white shadow-sm border border-calm-200 mb-4">
          {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap
                    ${msg.role === 'user' 
                        ? 'bg-focus text-white rounded-tr-none' 
                        : 'bg-calm-100 text-calm-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                  </div>
              </div>
          ))}
          {isTyping && (
              <div className="flex justify-start">
                  <div className="bg-calm-100 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                      <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce delay-200"></div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-4 rounded-xl border border-calm-300 focus:ring-2 focus:ring-focus focus:outline-none shadow-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-calm-800 hover:bg-calm-900 text-white px-6 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
              <i className="fa-solid fa-paper-plane"></i>
          </button>
      </form>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button 
            type="button"
            onClick={() => setInput("I'm overwhelmed. Help me pick one thing.")}
            className="text-xs bg-calm-200 hover:bg-calm-300 text-calm-700 px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
          >
            I'm overwhelmed
          </button>
          <button 
            type="button"
            onClick={() => setInput("Draft a polite email to decline a meeting.")}
            className="text-xs bg-calm-200 hover:bg-calm-300 text-calm-700 px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
          >
            Draft decline email
          </button>
          <button 
            type="button"
            onClick={() => setInput("Explain the Eisenhower Matrix.")}
            className="text-xs bg-calm-200 hover:bg-calm-300 text-calm-700 px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
          >
            Prioritization help
          </button>
      </div>
    </div>
  );
};

export default Chat;