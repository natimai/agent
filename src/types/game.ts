import { Player } from './player';

export type GameSpeed = 1 | 2 | 3 | 4;

export interface MatchResult {
  opponent: string;
  result: string;
  stats: {
    minutesPlayed: number;
    goals: number;
    assists: number;
    rating: number;
  };
}

export interface InjuryEvent {
  type: 'Minor' | 'Medium' | 'Severe';
  durationDays: number;
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
}

export interface MonthlyReportDetails {
  income: { [key: string]: number };
  expenses: { [key: string]: number };
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
  difficulty: string;
}

export interface GameSave {
  saveDate: string;
  gameState: GameState;
  players: Player[];
  user: any;
} 