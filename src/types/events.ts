import { Player } from './player';
import { GameEvent } from './game';

export type TransferOfferData = {
  player: Player;
  fromClub: string;
  toClub: string;
  offerAmount: number;
  weeklyWage: number;
  agentFee: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  expiryDate: string;
  bonuses?: {
    type: string;
    amount: number;
    conditions: string;
  }[];
  clauses?: {
    type: string;
    description: string;
    value: number;
  }[];
};

export type ContractExpiryData = {
  player: Player;
  daysRemaining: number;
  currentClub: string;
  currentSalary: number;
  marketValue: number;
  potentialClubs?: string[];
  negotiations?: {
    club: string;
    status: 'ONGOING' | 'COMPLETED' | 'FAILED';
    lastUpdate: string;
  }[];
};

export type InjuryData = {
  player: Player;
  type: 'Minor' | 'Medium' | 'Severe';
  durationDays: number;
  startDate: string;
  endDate: string;
  description: string;
  treatment?: string;
  recoveryProgress?: number;
  medicalReport?: string;
  expectedReturnDate: string;
};

export type MatchResultData = {
  player: Player;
  club: string;
  opponent: string;
  result: string;
  competition: string;
  venue: string;
  attendance: number;
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
    fouls: number;
    yellowCards: number;
    redCards: number;
  };
  highlights?: {
    minute: number;
    type: string;
    description: string;
  }[];
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
    category?: string | null;
    status?: string | null;
    priority?: string | null;
    searchQuery?: string;
    participants?: string[];
  };
  sortBy: 'date' | 'importance' | 'type' | 'priority' | 'status';
  sortDirection: 'asc' | 'desc';
  selectedEvent: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  lastUpdate?: string;
  activeEvents: number;
  completedEvents: number;
  upcomingEvents: GameEvent[];
}

export const EVENT_TYPES = {
  TRANSFER: 'TRANSFER',
  SCOUTING: 'SCOUTING',
  FINANCE: 'FINANCE',
  PLAYER: 'PLAYER',
  MISSION: 'MISSION',
  OFFICE: 'OFFICE',
  SYSTEM: 'SYSTEM',
  CONTRACT: 'CONTRACT',
  INJURY: 'INJURY',
  MATCH: 'MATCH',
  ACHIEVEMENT: 'ACHIEVEMENT'
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export interface Event extends GameEvent {
  location: string;
  participants?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
    uploadedAt?: string;
  }[];
  reminders?: {
    id: string;
    time: string;
    message: string;
    sent: boolean;
    type?: 'EMAIL' | 'PUSH' | 'IN_APP';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  category?: EventType;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  metadata?: Record<string, any>;
  lastUpdated?: string;
  createdBy?: string;
  assignedTo?: string[];
} 