
import React from 'react';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import { PenTool } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="no-print h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <PenTool size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">CoverCraft</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-2 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              BETA
            </span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <div className="no-print mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create your perfect cover letter</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Paste your CV and the job description below. Our AI will craft a tailored, professional letter in seconds.
          </p>
        </div>

        <CoverLetterBuilder />
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2025 CoverCraft AI. Built for the modern job market.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
