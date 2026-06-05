/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, X } from 'lucide-react';

import { useCandidates } from '../context/CandidateContext';

export const NotificationManager: React.FC = () => {
  const { scheduledMocks } = useCandidates();
  const [activeDispatchQueue, setActiveDispatchQueue] = useState<string[]>([]);
  
  const [dispatchedRegistry, setDispatchedRegistry] = useState<Set<string>>(new Set());

  useEffect(() => {
    /* 
     * Core Lifecycle Poller 
     * Continually inspects temporal state against local queue bounds
     */
    const activeListenerDaemon = setInterval(() => {
      const temporalCurrentState = new Date();
      const outboundQueueBuffer: string[] = [];

      scheduledMocks.forEach(mockPayload => {
        if (dispatchedRegistry.has(mockPayload.id)) return;

        const [yearBound, monthBound, dayBound] = mockPayload.date.split('-').map(Number);
        const [hourRange, minuteRange] = mockPayload.time.split(':').map(Number);
        
        const temporalMockThreshold = new Date(yearBound, monthBound - 1, dayBound, hourRange, minuteRange, 0);
        const absoluteTemporalDelta = temporalMockThreshold.getTime() - temporalCurrentState.getTime();
        const absoluteTemporalMetrics = Math.floor(absoluteTemporalDelta / 60000);

        if (absoluteTemporalMetrics === 5) {
            outboundQueueBuffer.push(`⚠️ Upcoming Mock: ${mockPayload.candidateName} in 5 minutes!`);
            setDispatchedRegistry(prev => new Set(prev).add(mockPayload.id));
        }
      });

      if (outboundQueueBuffer.length > 0) {
        setActiveDispatchQueue(prev => [...prev, ...outboundQueueBuffer]);
      }
    }, 10000);

    return () => clearInterval(activeListenerDaemon);
  }, [scheduledMocks, dispatchedRegistry]);

  const purgeDispatchAlert = (targetIndex: number) => {
    setActiveDispatchQueue(prev => prev.filter((_, iteratorNode) => iteratorNode !== targetIndex));
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {activeDispatchQueue.map((alertMessage, systemIndexRef) => (
          <motion.div
            key={`${systemIndexRef}-${alertMessage}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.3)] backdrop-blur-xl flex items-center gap-4 pointer-events-auto w-80"
          >
            <div className="bg-yellow-500/20 p-2 rounded-full">
               <BellRing className="text-yellow-400" size={18} />
            </div>
            <p className="text-sm font-semibold text-yellow-100 leading-tight">
              {alertMessage}
            </p>
            <button 
              onClick={() => purgeDispatchAlert(systemIndexRef)}
              className="ml-auto text-yellow-500/50 hover:text-yellow-400 transition-colors p-1"
            >
               <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
