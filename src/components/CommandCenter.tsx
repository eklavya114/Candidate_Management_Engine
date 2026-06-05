/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useState, useMemo } from 'react';
import { Search, Trash2, Maximize2, User, Clock, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useCandidates } from '../context/CandidateContext';
import { CandidateLog } from '../types';
import { CommandAnalytics } from './CommandAnalytics';

interface CommandCenterProps {
  onImageOpen: (base64: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onImageOpen }) => {
  const { logs, deleteLog, scheduledMocks, deleteScheduledMock } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const uniqueCandidateRegistry = useMemo(() => {
    const names = new Set([...logs.map(l => l.candidateName), ...scheduledMocks.map(m => m.candidateName)]);
    return Array.from(names);
  }, [logs, scheduledMocks]);

  const activeSearchQuery = useMemo(() => {
    if (!searchTerm) return [];
    return uniqueCandidateRegistry.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, uniqueCandidateRegistry]);

  const activeProfileLogs = useMemo(() => {
    if (selectedProfileId) {
      return logs.filter(log => log.candidateName === selectedProfileId);
    }
    if (searchTerm) {
      return logs.filter(log => 
        log.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.feedback.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return logs;
  }, [logs, selectedProfileId, searchTerm]);

  const activeProfileMocks = useMemo(() => {
    let dataset = scheduledMocks;
    const currentSystemDate = new Date().toISOString().split('T')[0];

    if (selectedProfileId) {
      dataset = dataset.filter(m => m.candidateName === selectedProfileId);
    } else if (searchTerm) {
      dataset = dataset.filter(m => 
        m.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.note.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      dataset = dataset.filter(m => m.date === currentSystemDate);
    }

    return dataset.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [scheduledMocks, selectedProfileId, searchTerm]);

  const executeProfileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (selectedProfileId) setSelectedProfileId(null);
  };

  const bindProfileSelection = (candidate: string) => {
    setSelectedProfileId(candidate);
    setSearchTerm('');
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c !== candidate);
      return [candidate, ...filtered].slice(0, 5);
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="relative shrink-0 z-20">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Search Candidate Database..."
          value={selectedProfileId || searchTerm}
          onChange={executeProfileSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-blue-500/30 backdrop-blur-xl text-slate-200 placeholder-slate-500 transition-colors"
        />
        
        <AnimatePresence>
          {isSearchFocused && !searchTerm && !selectedProfileId && recentSearches.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-2xl p-2 z-50"
            >
              <div className="px-3 pb-2 pt-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                 <History size={10} /> Recent Searches
              </div>
              {recentSearches.map((candidate, idx) => (
                <button
                  key={`recent-${idx}`}
                  onClick={() => bindProfileSelection(candidate)}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors rounded-lg flex items-center gap-3"
                >
                  <User size={14} className="text-slate-500" />
                  {candidate}
                </button>
              ))}
            </motion.div>
          )}

          {searchTerm && !selectedProfileId && activeSearchQuery.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-2xl p-1 z-50"
            >
              {activeSearchQuery.map((candidate, idx) => (
                <button
                  key={idx}
                  onClick={() => bindProfileSelection(candidate)}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors border-b border-white/5 last:border-0 rounded-lg flex items-center gap-3"
                >
                  <User size={14} className="text-blue-500" />
                  {candidate}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {selectedProfileId ? (
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400/80">Candidate Profile</h2>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
               Total Records: {activeProfileLogs.length}
            </div>
          </div>
        ) : (
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400/80 mb-2">Global Timeline</h2>
        )}
        
        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-2xl overflow-y-auto custom-scrollbar relative shadow-2xl">
          
          {selectedProfileId && (
             <div className="mb-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-medium text-white/90">{selectedProfileId}</h1>
                    <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">Verified Profile</p>
                  </div>
                </div>
             </div>
          )}

          {!selectedProfileId && !searchTerm && (
             <CommandAnalytics />
          )}

          {activeProfileMocks.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-500/80 mb-4 flex items-center gap-2">
                <Clock size={12} /> {selectedProfileId || searchTerm ? 'Scheduled Mocks' : 'Upcoming Mocks Today'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeProfileMocks.map(mock => (
                  <div key={mock.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-yellow-400">
                        {mock.date} &bull; {mock.time}
                      </span>
                      <button onClick={() => deleteScheduledMock(mock.id)} className="text-slate-500 hover:text-emerald-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                        <CheckCircle2 size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-white/90 mb-1">{mock.candidateName}</span>
                    {mock.note && <p className="text-xs text-slate-400 truncate">{mock.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {logs.length === 0 && scheduledMocks.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">No Interactions Logged</span>
            </div>
          ) : activeProfileLogs.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">No Results Found</span>
            </div>
          ) : (
            <div className="relative min-h-full">
              <div className="absolute left-8 top-2 bottom-8 w-[1px] bg-gradient-to-b from-blue-500/40 via-white/10 to-transparent pointer-events-none" />

              <div className="flex flex-col gap-8 pb-10">
                <AnimatePresence>
                  {activeProfileLogs.map((log, i) => (
                    <TimelineEpochNode 
                      key={log.id} 
                      log={log} 
                      index={i} 
                      onImageOpen={() => log.screenshotBase64 && onImageOpen(log.screenshotBase64)} 
                      onDelete={() => deleteLog(log.id)}
                      showName={!selectedProfileId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineEpochNode: React.FC<{ log: CandidateLog, index: number, onImageOpen: () => void, onDelete: () => void, showName: boolean }> = ({ log, index, onImageOpen, onDelete, showName }) => {
  const formattedDate = new Date(log.timestamp).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}).toUpperCase();
  const formattedTime = new Date(log.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative pl-14 group"
    >
      <div className="absolute left-[26px] top-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-[#050505] z-10" />
      
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-mono text-blue-400 tracking-wider flex items-center gap-1.5 uppercase">
               {formattedDate} &bull; {formattedTime}
            </span>
            <button 
              onClick={onDelete}
              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
              title="Obviate record"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {showName && <h3 className="text-base font-medium text-white/90">{log.candidateName}</h3>}
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">{log.feedback}</p>
        </div>
        
        {log.screenshotBase64 && (
          <div 
            onClick={onImageOpen}
            className="w-32 h-20 rounded-lg border border-white/10 bg-black/40 p-1 shrink-0 overflow-hidden cursor-pointer group/img"
          >
             <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center relative overflow-hidden">
                <img src={log.screenshotBase64} alt="Forensic Evidence" className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <Maximize2 size={12} className="text-white drop-shadow" />
                </div>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
