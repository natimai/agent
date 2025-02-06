import { Position } from './position';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  handling?: number; // רק לשוערים
  reflexes?: number; // רק לשוערים
  positioning?: number; // רק לשוערים
  // תכונות נוספות לפי הצורך
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  cleanSheets?: number; // רק לשוערים
  averageRating: number;
}

export interface PlayerPosition {
  main: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  secondary?: PlayerPosition['main'][];
}

export interface PlayerContract {
  startDate: string;
  endDate: string;
  value: number;
  club?: string;
}

export interface PlayerInjury {
  type: string;
  startDate: string;
  durationDays: number;
  isRecovered: boolean;
}

export interface LastMatch {
  date: string;
  opponent: string;
  result: string;
  stats: {
    minutesPlayed: number;
    goals: number;
    assists: number;
    rating: number;
  };
}

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  image?: string;
  position: PlayerPosition;
  value: number;
  wage: number;
  potential: number;
  form: number;
  isInjured: boolean;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  injuryHistory: PlayerInjury[];
  lastMatch?: LastMatch;
  contract: {
    startDate: string;
    endDate: string;
    releaseClause?: number;
  };
  development: {
    trainingPerformance: number;
    lastProgressDate: string;
    potentialGrowth: number;
  };
  marketStatus: {
    isTransferListed: boolean;
    isLoanListed: boolean;
    askingPrice?: number;
    interestedClubs: string[];
  };
  personality: {
    determination: number;
    leadership: number;
    teamwork: number;
    pressure: number;
  };
} 