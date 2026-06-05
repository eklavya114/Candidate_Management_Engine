/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useState } from 'react';
import { Radar } from 'lucide-react';

import { CandidateProvider } from './context/CandidateContext';
import { LoggingStation } from './components/LoggingStation';
import { CommandCenter } from './components/CommandCenter';
import { ImageModal } from './components/ImageModal';
import { NotificationManager } from './components/NotificationManager';

function ApplicationOrchestrator() {
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<string | null>(null);

  return (
    <div className="h-screen bg-[#050505] text-slate-200 font-sans flex flex-col overflow-hidden">
      <NotificationManager />
      
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <div className="w-4 h-4 border-2 border-white/90 rotate-45"></div>
          </div>
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/90">Candidate Management Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 hidden sm:inline">System Active</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
          <LoggingStation />
        </aside>
        
        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
          <CommandCenter onImageOpen={setActiveEvidenceModal} />
        </section>
      </main>

      <footer className="h-8 border-t border-white/5 bg-black/60 px-8 flex items-center justify-between shrink-0">
        <div className="flex gap-6">
          <span className="text-[9px] uppercase tracking-widest text-slate-500">Engine v2.0.42</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[9px] uppercase tracking-widest text-slate-500">Sync: Stable</span>
        </div>
      </footer>

      <ImageModal 
        isOpen={!!activeEvidenceModal} 
        base64Image={activeEvidenceModal} 
        onClose={() => setActiveEvidenceModal(null)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <CandidateProvider>
      <ApplicationOrchestrator />
    </CandidateProvider>
  );
}
