import { Player } from './player';
import { Team, TeamStats } from './team';
import { TransferMarket } from './transfers';
import { ExtendedOfficeState } from './office';
import { ScoutingState } from './scouting';
import { AuthState } from '../store/slices/authSlice';
import { FinanceState } from './finance';
import { GameState } from './game';
import { AgentState } from '../store/slices/agentSlice';
import { AssetsState } from './assets';
import { EquipmentState } from '../store/slices/equipmentSlice';
import { ContactsState } from './contacts';
import { EventsState } from './events';
import { MissionsState } from './missions';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'agent';
  createdAt: string;
  lastLogin: string;
  settings?: {
    theme: 'light' | 'dark';
    language: 'he' | 'en';
    notifications: boolean;
  };
  profile?: {
    fullName: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
}

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  data?: any;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  expiresAt?: string;
}

export interface TreasuryState {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  lastUpdate: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PlayersState {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  filters: {
    position: string | null;
    minAge: number | null;
    maxAge: number | null;
    minValue: number | null;
    maxValue: number | null;
    nationality: string | null;
    ageRange?: {
      min: number;
      max: number;
    };
    valueRange?: {
      min: number;
      max: number;
    };
    searchQuery?: string;
    status?: 'ALL' | 'AVAILABLE' | 'INJURED' | 'TRANSFER_LISTED';
  };
  sort: {
    field: keyof Player | null;
    direction: 'asc' | 'desc';
  };
  selectedPlayer: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface TeamState {
  team: Team;
  stats: TeamStats;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  filters: {
    type: string | null;
    read: boolean | null;
    dateRange: {
      start: string | null;
      end: string | null;
    };
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
    category?: string | null;
    searchQuery?: string;
  };
  sort: {
    field: 'date' | 'type' | 'importance' | 'priority';
    direction: 'asc' | 'desc';
  };
  selectedNotification: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  lastUpdate?: string;
  settings: {
    sound: boolean;
    desktop: boolean;
    email: boolean;
    pushNotifications: boolean;
  };
}

export interface SalaryPayment {
  id: string;
  date: string;
  amount: number;
  scoutId: string;
  type: 'SCOUT_SALARY' | 'STAFF_SALARY' | 'PLAYER_SALARY';
  status: 'PENDING' | 'PAID' | 'FAILED';
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export interface NegotiationMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: string;
    url: string;
  }[];
}

export interface RootState {
  auth: AuthState;
  players: PlayersState;
  finance: FinanceState;
  game: GameState;
  agent: AgentState;
  assets: AssetsState;
  equipment: EquipmentState;
  scouting: ScoutingState;
  contacts: ContactsState;
  events: EventsState;
  treasury: TreasuryState;
  notifications: NotificationsState;
  team: TeamState;
  transfers: TransferMarket;
  missions: MissionsState;
  office: ExtendedOfficeState;
} 