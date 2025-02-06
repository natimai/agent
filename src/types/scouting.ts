export interface Scout {
  id: string;
  name: string;
  level: number;
  experience: number;
  specialization: 'youth' | 'senior' | 'both';
  regions: string[];
  currentMission?: string;
  stats: {
    successfulMissions: number;
    failedMissions: number;
    playersDiscovered: number;
    averageReportAccuracy: number;
  };
  salary: number;
  contract: {
    startDate: string;
    endDate: string;
  };
}

export interface ScoutingMission {
  id: string;
  title: string;
  description: string;
  type: 'player' | 'team' | 'tournament';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  assignedScout?: string;
  target: {
    name: string;
    location: string;
    details: Record<string, any>;
  };
  duration: number; // בימים
  startDate?: string;
  endDate?: string;
  budget: number;
  report?: {
    findings: string;
    recommendations: string;
    rating: number;
    date: string;
  };
}

export interface ScoutingReport {
  id: string;
  missionId: string;
  scoutId: string;
  date: string;
  content: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    potential: number;
    recommendedAction: string;
  };
  attachments?: {
    type: string;
    url: string;
  }[];
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  reviewerNotes?: string;
}

export interface ScoutingState {
  scouts: Scout[];
  missions: ScoutingMission[];
  reports: ScoutingReport[];
  loading: boolean;
  error: string | null;
} 