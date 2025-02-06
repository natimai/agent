import { Position } from './position';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  handling?: number;
  reflexes?: number;
  positioning?: number;
  goalkeeping: number;
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
}

export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'DM' | 'CM' | 'LM' | 'RM' | 'AM' | 'ST';

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
}

export interface LastMatch {
  date: string;
  opponent: string;
  result: string;
  rating: number;
  goals: number;
  assists: number;
  cleanSheet?: boolean;
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