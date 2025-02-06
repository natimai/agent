import { Player } from './player';
import { User } from './types';

export type GameSpeed = 1 | 2 | 3 | 4 | 5;

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface MatchResult {
  opponent: string;
  result: string;
  date: string;
  venue: string;
  competition: string;
  stats: {
    minutesPlayed: number;
    goals: number;
    assists: number;
    rating: number;
    passes: number;
    passAccuracy: number;
    shots: number;
    shotsOnTarget: number;
    tackles: number;
    interceptions: number;
  };
}

export interface InjuryEvent {
  type: 'Minor' | 'Medium' | 'Severe';
  durationDays: number;
  startDate: string;
  endDate: string;
  description: string;
  treatment?: string;
  recoveryProgress?: number;
}

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isHandled: boolean;
  isImportant: boolean;
  tags: string[];
  date: string;
  timestamp: string;
  data?: any;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  location?: string;
  participants?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
}

export interface MonthlyReportDetails {
  income: { [key: string]: number };
  expenses: { [key: string]: number };
  balance: number;
  stats: {
    totalTransfers: number;
    successfulDeals: number;
    failedDeals: number;
    activeNegotiations: number;
  };
}

export interface MonthlyReport {
  date: string;
  income: {
    commissions: number;
    sponsorships: number;
    bonuses: number;
    other: number;
  };
  expenses: {
    rent: number;
    utilities: number;
    salaries: number;
    misc: number;
  };
  balance: number;
  stats: {
    totalTransfers: number;
    successfulDeals: number;
    failedDeals: number;
    activeNegotiations: number;
  };
}

export interface SalaryPayment {
  date: string;
  amount: number;
  scoutId: string;
  type: 'SCOUT_SALARY' | 'STAFF_SALARY' | 'PLAYER_SALARY';
  status: 'PENDING' | 'PAID' | 'FAILED';
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export interface GameState {
  currentWeek: number;
  transferWindowOpen: boolean;
  events: GameEvent[];
  loading: boolean;
  error: string | null;
  treasury: number;
  currentDate: string;
  lastUpdate: string;
  gameSpeed: GameSpeed;
  isPaused: boolean;
  reputation: number;
  monthlyReports: MonthlyReport[];
  salaryPayments: SalaryPayment[];
  notifications: GameEvent[];
  season: number;
  difficulty: GameDifficulty;
  settings: {
    autoSave: boolean;
    notifications: boolean;
    sound: boolean;
    language: 'he' | 'en';
    theme: 'light' | 'dark';
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    unlockedDate?: string;
    progress?: number;
  }[];
}

export interface GameSave {
  id: string;
  saveDate: string;
  gameState: GameState;
  players: Player[];
  user: User;
  version: string;
  checksum: string;
  metadata: {
    playTime: number;
    lastSaved: string;
    gameVersion: string;
    platform: string;
  };
} 