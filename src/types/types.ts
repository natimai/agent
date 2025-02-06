import { Player } from './player';
import { Team, TeamStats } from './team';
import { TransferMarket } from './transfers';
import { ExtendedOfficeState } from './office';
import { ScoutingState } from './scouting';

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
  players: PlayersState;
  transfers: TransferMarket;
  office: ExtendedOfficeState;
  treasury: TreasuryState;
  notifications: NotificationsState;
  team: TeamState;
  scouting: ScoutingState;
} 