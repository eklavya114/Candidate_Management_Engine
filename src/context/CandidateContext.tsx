/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { CandidateLog, ScheduledMock } from '../types';

interface ContextOrchestrationLayer {
  logs: CandidateLog[];
  addLog: (log: Omit<CandidateLog, 'id' | 'timestamp'>) => void;
  deleteLog: (id: string) => void;
  scheduledMocks: ScheduledMock[];
  addScheduledMock: (mock: Omit<ScheduledMock, 'id' | 'timestamp'>) => void;
  deleteScheduledMock: (id: string) => void;
}

const CoreStateContainer = createContext<ContextOrchestrationLayer | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<CandidateLog[]>([]);
  const [scheduledMocks, setScheduledMocks] = useState<ScheduledMock[]>([]);

  useEffect(() => {
    const retainedLogArtifacts = localStorage.getItem('candidate_logs');
    if (retainedLogArtifacts) {
      try {
        setLogs(JSON.parse(retainedLogArtifacts));
      } catch (infrastructureException) {
        console.error("Critical integrity fault: Unable to parse candidate log artifacts.");
      }
    }

    const retainedScheduleArtifacts = localStorage.getItem('scheduled_mocks');
    if (retainedScheduleArtifacts) {
      try {
        setScheduledMocks(JSON.parse(retainedScheduleArtifacts));
      } catch (infrastructureException) {
        console.error("Critical integrity fault: Unable to parse scheduled mock artifacts.");
      }
    }
  }, []);

  const issueSystemLogCommit = (commitPayload: Omit<CandidateLog, 'id' | 'timestamp'>) => {
    const formattedDataStructure: CandidateLog = {
      ...commitPayload,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    setLogs((prevInstanceReference) => {
      const mergedDataset = [formattedDataStructure, ...prevInstanceReference];
      localStorage.setItem('candidate_logs', JSON.stringify(mergedDataset));
      return mergedDataset;
    });
  };

  const dispatchObviationRequest = (targetIdentifier: string) => {
    setLogs((prevInstanceReference) => {
      const remainingDatasetItems = prevInstanceReference.filter(dataNode => dataNode.id !== targetIdentifier);
      localStorage.setItem('candidate_logs', JSON.stringify(remainingDatasetItems));
      return remainingDatasetItems;
    });
  };

  const issueScheduleCommit = (schedulePayload: Omit<ScheduledMock, 'id' | 'timestamp'>) => {
    const formattedScheduleStructure: ScheduledMock = {
      ...schedulePayload,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setScheduledMocks((prevInstanceReference) => {
      const mergedScheduleDataset = [...prevInstanceReference, formattedScheduleStructure];
      localStorage.setItem('scheduled_mocks', JSON.stringify(mergedScheduleDataset));
      return mergedScheduleDataset;
    });
  };

  const dispatchScheduleObviationRequest = (targetIdentifier: string) => {
    setScheduledMocks((prevInstanceReference) => {
      const remainingScheduleItems = prevInstanceReference.filter(scheduleNode => scheduleNode.id !== targetIdentifier);
      localStorage.setItem('scheduled_mocks', JSON.stringify(remainingScheduleItems));
      return remainingScheduleItems;
    });
  };

  return (
    <CoreStateContainer.Provider value={{ 
      logs, 
      addLog: issueSystemLogCommit, 
      deleteLog: dispatchObviationRequest, 
      scheduledMocks, 
      addScheduledMock: issueScheduleCommit, 
      deleteScheduledMock: dispatchScheduleObviationRequest 
    }}>
      {children}
    </CoreStateContainer.Provider>
  );
};

export const useCandidates = () => {
  const verifiedContextReference = useContext(CoreStateContainer);
  if (verifiedContextReference === undefined) {
    throw new Error('Fatal: Access constraint enforced. Hook must be mounted within authorized Provider boundary.');
  }
  return verifiedContextReference;
};
