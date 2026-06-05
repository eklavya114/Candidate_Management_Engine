/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

import { useCandidates } from '../context/CandidateContext';

export const LoggingStation: React.FC = () => {
  const { addLog, addScheduledMock } = useCandidates();
  
  const [activeSegment, setActiveSegment] = useState<'log' | 'schedule'>('log');

  const [dateSequence, setDateSequence] = useState(() => new Date().toISOString().split('T')[0]);
  const [targetIdentity, setTargetIdentity] = useState('');
  const [interactionStatus, setInteractionStatus] = useState('Completed');
  const [sessionFeedback, setSessionFeedback] = useState('');
  const [encodedEvidence, setEncodedEvidence] = useState<string | null>(null);
  const [timeSequence, setTimeSequence] = useState('12:00');
  
  const [activeDropZone, setActiveDropZone] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processForensicEvidence = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEncodedEvidence(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const bindDropZoneActive = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropZone(true);
  };
  
  const releaseDropZoneActive = () => {
    setActiveDropZone(false);
  };

  const consumeEvidenceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropZone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processForensicEvidence(e.dataTransfer.files[0]);
    }
  };

  const commitCandidateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIdentity.trim()) return;

    if (activeSegment === 'log') {
      if (!sessionFeedback.trim()) return;
      addLog({
        candidateName: targetIdentity.trim(),
        date: dateSequence,
        status: interactionStatus,
        feedback: sessionFeedback.trim(),
        screenshotBase64: encodedEvidence,
      });
      setSessionFeedback('');
      setEncodedEvidence(null);
      interactionStatus !== 'Completed' && setInteractionStatus('Completed');
    } else {
      addScheduledMock({
        candidateName: targetIdentity.trim(),
        date: dateSequence,
        time: timeSequence,
        note: sessionFeedback.trim(),
      });
      setSessionFeedback('');
      setTimeSequence('12:00');
    }

    setTargetIdentity('');
    setDateSequence(new Date().toISOString().split('T')[0]);
    
    setTransactionSuccess(true);
    setTimeout(() => setTransactionSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400/80">Station</h2>
        <div className="flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setActiveSegment('log')}
            className={`px-3 py-1 text-[9px] uppercase tracking-widest rounded transition-colors ${activeSegment === 'log' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Log
          </button>
          <button 
            onClick={() => setActiveSegment('schedule')}
            className={`px-3 py-1 text-[9px] uppercase tracking-widest rounded transition-colors ${activeSegment === 'schedule' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Schedule
          </button>
        </div>
      </div>
      
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-2xl flex flex-col shadow-2xl flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4 flex flex-col gap-5">
          <form id="logging-form" onSubmit={commitCandidateLog} className="flex flex-col gap-5">
            <div className="flex gap-3">
              <div className="space-y-1.5 flex-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={dateSequence}
                  onChange={(e) => setDateSequence(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              {activeSegment === 'schedule' && (
                <div className="space-y-1.5 flex-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">Time</label>
                  <input 
                    type="time" 
                    required
                    value={timeSequence}
                    onChange={(e) => setTimeSequence(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">Candidate Identity</label>
              <input 
                type="text" 
                required
                placeholder="Enter full name..."
                value={targetIdentity}
                onChange={(e) => setTargetIdentity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            {activeSegment === 'log' && (
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">Mock Status</label>
                <select 
                  value={interactionStatus}
                  onChange={(e) => setInteractionStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="Completed" className="bg-[#050505] text-slate-200">Completed</option>
                  <option value="Denied / No Show" className="bg-[#050505] text-slate-200">Denied / No Show</option>
                  <option value="Rescheduled" className="bg-[#050505] text-slate-200">Rescheduled</option>
                </select>
              </div>
            )}

            {activeSegment === 'log' && (
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">Forensic Evidence</label>
                <div 
                  onDragOver={bindDropZoneActive}
                  onDragLeave={releaseDropZoneActive}
                  onDrop={consumeEvidenceDrop}
                  onClick={() => !encodedEvidence && fileInputRef.current?.click()}
                  className={`h-24 border-2 border-dashed rounded-xl overflow-hidden transition-colors relative flex flex-col items-center justify-center gap-2 ${activeDropZone ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 bg-white/[0.01] hover:bg-white/[0.03]'} ${!encodedEvidence ? 'cursor-pointer' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {encodedEvidence ? (
                      <motion.div 
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 w-full h-full group"
                      >
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setEncodedEvidence(null); }}
                            className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-md transform transition-transform hover:scale-110 shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <img src={encodedEvidence} alt="Evidence Payload Data" className="w-full h-full object-cover" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2 pointer-events-none"
                      >
                        <div className="w-6 h-6 border-2 border-slate-500 border-dashed rounded flex items-center justify-center text-slate-500 leading-none">
                          +
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Drop or Click to Upload</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        processForensicEvidence(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 mb-2">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                {activeSegment === 'log' ? 'Interaction Feedback' : 'Quick Note (Optional)'}
              </label>
              <textarea 
                required={activeSegment === 'log'}
                rows={3}
                placeholder={activeSegment === 'log' ? "Log details..." : "Any context for the scheduled mock..."}
                value={sessionFeedback}
                onChange={(e) => setSessionFeedback(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none leading-relaxed"
              />
            </div>
          </form>
        </div>

        <div className="shrink-0 flex flex-col gap-2 pt-2">
          <AnimatePresence>
            {transactionSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20"
              >
                Record Successfully Committed
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            type="submit"
            form="logging-form"
            className="w-full bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 rounded-lg border border-blue-400/30 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.2)] active:scale-[0.99]"
          >
            {activeSegment === 'log' ? 'Commit Record' : 'Schedule Mock'}
          </button>
        </div>
      </div>
    </div>
  );
};
