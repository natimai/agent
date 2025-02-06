import { Player } from './player';
import { GameEvent } from './game';

export type TransferOfferData = {
  player: Player;
  fromClub: string;
  toClub: string;
  offerAmount: number;
  weeklyWage: number;
  agentFee: number;
};

export type ContractExpiryData = {
  player: Player;
  daysRemaining: number;
};

export type InjuryData = {
  player: Player;
  type: 'Minor' | 'Medium' | 'Severe';
  durationDays: number;
};

export type MatchResultData = {
  player: Player;
  club: string;
  opponent: string;
  result: string;
  stats: {
    goals: number;
    assists: number;
    minutesPlayed: number;
    rating: number;
  };
};

export type GameEventData = 
  | { type: 'TRANSFER_OFFER'; data: TransferOfferData }
  | { type: 'CONTRACT_EXPIRY'; data: ContractExpiryData }
  | { type: 'INJURY'; data: InjuryData }
  | { type: 'MATCH_RESULT'; data: MatchResultData };

export interface EventsState {
  events: GameEvent[];
  loading: boolean;
  error: string | null;
  filters: {
    type: string | null;
    importance: boolean | null;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  sortBy: 'date' | 'importance' | 'type';
  sortDirection: 'asc' | 'desc';
}

export const EVENT_TYPES = {
  TRANSFER: 'TRANSFER',
  SCOUTING: 'SCOUTING',
  FINANCE: 'FINANCE',
  PLAYER: 'PLAYER',
  MISSION: 'MISSION',
  OFFICE: 'OFFICE',
  SYSTEM: 'SYSTEM'
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export interface Event extends GameEvent {
  location: string;
  participants?: {
    id: string;
    name: string;
    role: string;
  }[];
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  reminders?: {
    id: string;
    time: string;
    message: string;
    sent: boolean;
  }[];
} 