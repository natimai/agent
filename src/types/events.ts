import { Player } from './player';

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

export type EventType = 'MATCH' | 'TRAINING' | 'MEETING' | 'SCOUTING' | 'OTHER';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location: string;
  isImportant: boolean;
  tags: string[];
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
    time: string; // ISO date string
    message: string;
    sent: boolean;
  }[];
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
} 