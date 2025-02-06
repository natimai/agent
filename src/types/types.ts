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

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface TreasuryState {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  lastUpdate: string;
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
  };
  sort: {
    field: keyof Player | null;
    direction: 'asc' | 'desc';
  };
}

export interface TeamState {
  team: Team;
  stats: TeamStats;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

export interface SalaryPayment {
  date: string;
  amount: number;
  scoutId: string;
  type: 'SCOUT_SALARY' | 'STAFF_SALARY' | 'PLAYER_SALARY';
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
} 