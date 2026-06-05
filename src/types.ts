/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
export interface CandidateLog {
  id: string;
  candidateName: string;
  date: string;
  status: string;
  feedback: string;
  screenshotBase64: string | null;
  timestamp: number;
}

export interface ScheduledMock {
  id: string;
  candidateName: string;
  date: string;
  time: string;
  note: string;
  timestamp: number;
}
