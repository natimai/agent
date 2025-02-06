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
  technique: number;
  vision: number;
  leadership: number;
  mentality: number;
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
  matchesWon: number;
  matchesLost: number;
  matchesDrawn: number;
  seasonStats: {
    goals: number;
    assists: number;
    appearances: number;
    rating: number;
  };
}

export interface PlayerContract {
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  salary: number;
  bonuses: ContractBonus[];
  releaseClause?: number;
  teamId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  terminationDate?: string;
  terminationReason?: string;
}

export interface ContractBonus {
  type: 'APPEARANCES' | 'GOALS' | 'ASSISTS' | 'CLEAN_SHEETS' | 'TROPHIES' | 'RESALE_PERCENTAGE' | 'PERFORMANCE' | 'LOYALTY';
  amount: number;
  threshold: number;
  achieved?: boolean;
  progress?: number;
}

export interface PlayerInjury {
  type: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  startDate: string;
  endDate: string;
  durationDays: number;
  isRecovered?: boolean;
  treatment?: string;
  recoveryProgress?: number;
  notes?: string;
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
    passes: number;
    passAccuracy: number;
    shots: number;
    shotsOnTarget: number;
    tackles: number;
    interceptions: number;
  };
}

export interface Player {
  id: string;
  name: string;
  nationality: string;
  age: number;
  position: Position;
  secondaryPosition?: Position[];
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
    temperament: number;
    sportsmanship: number;
  };
  isDiscovered: boolean;
  scoutingProgress?: number;
  isInjured: boolean;
  injuryHistory: PlayerInjury[];
  development: {
    trainingPerformance?: number;
    potentialGrowth?: number;
    lastProgressDate: string;
    strengths: string[];
    weaknesses: string[];
    trainingFocus?: string[];
  };
  marketStatus: {
    isTransferListed: boolean;
    isLoanListed: boolean;
    askingPrice?: number;
    interestedClubs: string[];
    lastTransferDate?: string;
    transferHistory?: {
      date: string;
      fromClub: string;
      toClub: string;
      fee: number;
      type: 'TRANSFER' | 'LOAN';
    }[];
  };
  wage: number;
  image?: string;
  avatar?: string;
  preferredFoot: 'RIGHT' | 'LEFT' | 'BOTH';
  height: number;
  weight: number;
  birthDate: string;
  birthPlace: string;
  internationalCaps?: number;
  internationalGoals?: number;
}

export const POSITION_NAMES: Record<Position, string> = {
  GK: 'שוער',
  CB: 'בלם מרכזי',
  LB: 'מגן שמאלי',
  RB: 'מגן ימני',
  DM: 'קשר הגנתי',
  CDM: 'קשר הגנתי מרכזי',
  CM: 'קשר מרכזי',
  LM: 'קשר שמאלי',
  RM: 'קשר ימני',
  AM: 'קשר התקפי',
  CAM: 'קשר התקפי מרכזי',
  LW: 'מקצה שמאלי',
  RW: 'מקצה ימני',
  ST: 'חלוץ'
}; 