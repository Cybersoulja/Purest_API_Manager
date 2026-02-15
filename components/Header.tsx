
import React from 'react';

interface HeaderProps {
  onRestartTour?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRestartTour }) => {
  return (
    <header id="header" className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Purest Builder</h1>
          <p className="text-xs text-slate-400">Expressive REST Client Generator</p>
        </div>
      </div>
      
      <nav className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onRestartTour}
          className="hidden sm:flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tour
        </button>
        <a href="https://github.com/simov/purest" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">Docs</a>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">Sign In</button>
      </nav>
    </header>
  );
};

export default Header;
