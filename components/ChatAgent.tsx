
import React, { useState, useRef, useEffect } from 'react';
import { generatePurestConfig } from '../services/geminiService';
import { ChatMessage, PurestConfig } from '../types';

interface ChatAgentProps {
  onUpdateConfig: (config: PurestConfig) => void;
}

const ChatAgent: React.FC<ChatAgentProps> = ({ onUpdateConfig }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your Purest API Agent. Tell me which API you want to integrate (e.g., "Build a client for Spotify" or "Setup a config for Stripe API").' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await generatePurestConfig(`User request: ${userMsg}. Provide a Purest configuration.`);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.explanation 
      }]);
      
      if (result.config && Object.keys(result.config).length > 0) {
        onUpdateConfig(result.config);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error building that config.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-slate-400 rounded-bl-none animate-pulse">
              Generating your config...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Create a config for Spotify API..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 p-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatAgent;
