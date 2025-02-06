import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameSpeed, GameEvent } from '../../types/game';
import { eventSystem } from '../../services/eventSystem';
import { saveManager } from '../../services/saveManager';

interface SalaryPayment {
  date: string;
  amount: number;
  details: { [key: string]: number };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export interface GameState {
  treasury: number;
  currentDate: string;
  gameSpeed: number;
  isPaused: boolean;
  events: GameEvent[];
  monthlyReports: GameState['monthlyReports'][0][];
  lastUpdate: string | null;
  reputation: number;
  salaryPayments: SalaryPayment[];
  isTransferWindow: boolean;
  currentWeek: number;
  transferWindowOpen: boolean;
  season: number;
  difficulty: 'easy' | 'medium' | 'hard';
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  treasury: 100000,
  currentDate: new Date().toISOString(),
  gameSpeed: 1,
  isPaused: true,
  events: [],
  monthlyReports: [],
  lastUpdate: null,
  reputation: 0,
  salaryPayments: [],
  isTransferWindow: false,
  currentWeek: 1,
  transferWindowOpen: false,
  season: 2024,
  difficulty: 'medium',
  notifications: [],
  loading: false,
  error: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateTreasury: (state, action: PayloadAction<number>) => {
      state.treasury += action.payload;
    },
    updateGameDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
      state.lastUpdate = new Date().toISOString();
    },
    setGameSpeed: (state, action: PayloadAction<number>) => {
      state.gameSpeed = action.payload;
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    updateReputation: (state, action: PayloadAction<number>) => {
      state.reputation = Math.max(0, Math.min(100, state.reputation + action.payload));
    },
    addGameEvent: (state, action: PayloadAction<GameEvent>) => {
      state.events.push(action.payload);
    },
    handleEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.isHandled = true;
      }
    },
    addMonthlyReport: (state, action: PayloadAction<GameState['monthlyReports'][0]>) => {
      state.monthlyReports.push(action.payload);
    },
    loadSavedGame: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
    addSalaryPayment: (state, action: PayloadAction<GameState['salaryPayments'][0]>) => {
      state.salaryPayments.push(action.payload);
    },
    advanceTime: (state) => {
      const currentDate = new Date(state.currentDate);
      const daysToAdvance = state.gameSpeed;
      currentDate.setDate(currentDate.getDate() + daysToAdvance);
      state.currentDate = currentDate.toISOString();
      state.lastUpdate = new Date().toISOString();
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
    addEvent: (state, action: PayloadAction<GameEvent>) => {
      state.events.push(action.payload);
    },
    addMonthlyReports: (state, action: PayloadAction<GameState['monthlyReports'][0]>) => {
      state.monthlyReports.push(action.payload);
    },
    advanceWeek: (state) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() + 7);
      state.currentDate = currentDate.toISOString();
      state.currentWeek++;
      state.transferWindowOpen = checkTransferWindow(currentDate);
      if (state.currentWeek > 52) {
        state.currentWeek = 1;
        state.season += 1;
      }
    },
    setDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard'>) => {
      state.difficulty = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    advanceDay: (state) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
      state.currentDate = currentDate.toISOString();
      if (currentDate.getDay() === 1) {
        state.currentWeek++;
      }
      state.transferWindowOpen = checkTransferWindow(currentDate);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

const checkTransferWindow = (date: Date): boolean => {
  const month = date.getMonth() + 1;
  return (month >= 7 && month <= 8) || (month === 1);
};

export const { 
  updateTreasury, 
  updateGameDate, 
  setGameSpeed, 
  setPaused,
  updateReputation,
  addGameEvent,
  handleEvent,
  addMonthlyReport,
  loadSavedGame,
  addSalaryPayment,
  advanceTime,
  togglePause,
  addEvent,
  addMonthlyReports,
  advanceWeek,
  setDifficulty,
  addNotification,
  removeNotification,
  clearNotifications,
  advanceDay,
  removeEvent,
  setLoading,
  setError
} = gameSlice.actions;

export default gameSlice.reducer; 