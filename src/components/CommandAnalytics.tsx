/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useMemo } from 'react';
import { Activity, Target, UserX } from 'lucide-react';

import { useCandidates } from '../context/CandidateContext';

export const CommandAnalytics: React.FC = () => {
    const { logs } = useCandidates();

    const deriveMetricStates = useMemo(() => {
        const payloadLength = logs.length;
        if (payloadLength === 0) return { total: 0, completed: 0, denied: 0 };
        
        let completedIncidences = 0;
        let deniedIncidences = 0;

        logs.forEach(log => {
            const currentStatus = log.status || 'Completed';
            if (currentStatus === 'Completed') completedIncidences++;
            if (currentStatus === 'Denied / No Show') deniedIncidences++;
        });

        return {
            total: payloadLength,
            completed: Math.round((completedIncidences / payloadLength) * 100),
            denied: Math.round((deniedIncidences / payloadLength) * 100),
        };
    }, [logs]);

    return (
        <div className="mb-10 bg-white/[0.02] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden group hover:border-blue-500/40 transition-colors duration-500">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />

            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400/80 mb-6 flex items-center gap-2 relative z-10">
                <Activity size={12} /> Command Analytics
            </h3>

            <div className="grid grid-cols-3 gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Total Logged</span>
                    <div className="text-3xl font-light text-white tracking-tight font-mono">{deriveMetricStates.total}</div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1">
                        <Target size={10} className="text-emerald-500" /> Completion Rate
                    </span>
                    <div className="text-3xl font-light text-emerald-400 tracking-tight font-mono">{deriveMetricStates.completed}%</div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1">
                        <UserX size={10} className="text-red-500" /> Dropped Rate
                    </span>
                    <div className="text-3xl font-light text-red-500/90 tracking-tight font-mono">{deriveMetricStates.denied}%</div>
                </div>
            </div>
        </div>
    );
};
