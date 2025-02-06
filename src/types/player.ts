import { Position } from './position';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  goalkeeping: number;
  handling?: number;
  reflexes?: number;
  positioning?: number;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  form: number;
  averageRating: number;
  minutesPlayed: number;
  totalRating: number;
}

export type PlayerPosition = Position;

export interface PlayerContract {
  team: string;
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  salary: number;
  bonuses: ContractBonus[];
  releaseClause?: number;
}

export interface ContractBonus {
  type: 'APPEARANCE' | 'GOAL' | 'ASSIST' | 'CLEAN_SHEET';
  amount: number;
  threshold: number;
}

export interface PlayerInjury {
  type: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  startDate: string;
  endDate: string;
  durationDays: number;
  isRecovered?: boolean;
}

export interface LastMatch {
  date: string;
  opponent: string;
  result: string;
  rating: number;
  goals: number;
  assists: number;
  cleanSheet?: boolean;
  stats: {
    goals: number;
    assists: number;
    minutesPlayed: number;
    rating: number;
  };
}

export interface Player {
  id: string;
  name: string;
  nationality: string;
  age: number;
  position: PlayerPosition;
  secondaryPosition?: PlayerPosition;
  teamId: string;
  value: number;
  potential: number;
  attributes: PlayerAttributes;
  contract: PlayerContract;
  stats: PlayerStats;
  form: number;
  morale: number;
  fitness: number;
  injury?: PlayerInjury;
  lastMatch?: LastMatch;
  personality: {
    ambition: number;
    loyalty: number;
    professionalism: number;
  };
  isDiscovered: boolean;
  scoutingProgress?: number;
  isInjured: boolean;
  injuryHistory: PlayerInjury[];
  development: {
    trainingPerformance?: number;
    potentialGrowth?: number;
    lastProgressDate: string;
  };
  marketStatus: {
    isTransferListed: boolean;
    isLoanListed: boolean;
    askingPrice?: number;
    interestedClubs: string[];
  };
  wage: number;
  image?: string;
  avatar?: string;
}

export const POSITION_NAMES: Record<PlayerPosition, string> = {
  GK: 'שוער',
  CB: 'בלם מרכזי',
  LB: 'מגן שמאלי',
  RB: 'מגן ימני',
  DM: 'קשר הגנתי',
  CM: 'קשר מרכזי',
  LM: 'קשר שמאלי',
  RM: 'קשר ימני',
  AM: 'קשר התקפי',
  ST: 'חלוץ'
}; 