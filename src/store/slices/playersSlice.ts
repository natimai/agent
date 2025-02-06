import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerInjury } from '../../types/player';

interface PlayersState {
  players: Player[];
  loading: boolean;
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

const initialPlayers: Player[] = [
  {
    id: '1',
    name: 'רון חולדאי',
    position: 'FW',
    nationality: 'ישראל',
    birthDate: '2000-01-01',
    height: 180,
    weight: 75,
    value: 1000000,
    salary: 10000,
    contractStart: '2023-01-01',
    contractEnd: '2024-01-01',
    team: 'הפועל תל אביב',
    isHot: true,
    attributes: {
      pace: 80,
      shooting: 75,
      passing: 70,
      dribbling: 85,
      defending: 40,
      physical: 65
    },
    stats: {
      matches: 20,
      goals: 15,
      assists: 8,
      cleanSheets: 0,
      yellowCards: 2,
      redCards: 0
    },
    form: 8,
    potential: 85,
    marketValue: 1200000,
    injuries: []
  },
  {
    id: '2',
    name: 'דני אבדיה',
    position: 'MF',
    nationality: 'ישראל',
    birthDate: '1999-05-15',
    height: 175,
    weight: 70,
    value: 800000,
    salary: 8000,
    contractStart: '2023-01-01',
    contractEnd: '2024-06-30',
    team: 'מכבי תל אביב',
    isHot: false,
    attributes: {
      pace: 75,
      shooting: 70,
      passing: 85,
      dribbling: 80,
      defending: 60,
      physical: 70
    },
    stats: {
      matches: 18,
      goals: 5,
      assists: 12,
      cleanSheets: 0,
      yellowCards: 3,
      redCards: 0
    },
    form: 7,
    potential: 80,
    marketValue: 900000,
    injuries: []
  }
];

const initialState: PlayersState = {
  players: initialPlayers,
  loading: false,
  error: null,
  filters: {
    position: null,
    minAge: null,
    maxAge: null,
    minValue: null,
    maxValue: null,
    nationality: null,
  },
  sort: {
    field: null,
    direction: 'desc',
  },
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    updatePlayer: (state, action: PayloadAction<Player>) => {
      const index = state.players.findIndex(player => player.id === action.payload.id);
      if (index !== -1) {
        state.players[index] = action.payload;
      }
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter(player => player.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updatePlayerValue: (state, action: PayloadAction<{ id: string; newValue: number }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.value = action.payload.newValue;
      }
    },
    updatePlayerWage: (state, action: PayloadAction<{ id: string; newWage: number }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.wage = action.payload.newWage;
      }
    },
    updatePlayerForm: (state, action: PayloadAction<{ id: string; newForm: number }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.form = Math.max(0, Math.min(100, action.payload.newForm));
      }
    },
    addPlayerInjury: (state, action: PayloadAction<{ id: string; injury: PlayerInjury }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.isInjured = true;
        player.injuryHistory.push(action.payload.injury);
      }
    },
    recoverFromInjury: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.isInjured = false;
        const lastInjury = player.injuryHistory[player.injuryHistory.length - 1];
        if (lastInjury) {
          lastInjury.isRecovered = true;
        }
      }
    },
    updatePlayerStats: (state, action: PayloadAction<{ 
      id: string; 
      goals?: number;
      assists?: number;
      appearances?: number;
      minutesPlayed?: number;
      yellowCards?: number;
      redCards?: number;
      cleanSheets?: number;
      rating?: number;
    }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        const { id, ...updates } = action.payload;
        player.stats = {
          ...player.stats,
          ...updates,
          averageRating: updates.rating 
            ? (player.stats.averageRating * player.stats.appearances + updates.rating) / 
              (player.stats.appearances + (updates.appearances || 0))
            : player.stats.averageRating
        };
      }
    },
    updatePlayerDevelopment: (state, action: PayloadAction<{
      id: string;
      trainingPerformance?: number;
      potentialGrowth?: number;
    }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        const { id, ...updates } = action.payload;
        player.development = {
          ...player.development,
          ...updates,
          lastProgressDate: new Date().toISOString()
        };
      }
    },
    updateMarketStatus: (state, action: PayloadAction<{
      id: string;
      isTransferListed?: boolean;
      isLoanListed?: boolean;
      askingPrice?: number;
      interestedClub?: string;
    }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        const { id, interestedClub, ...updates } = action.payload;
        player.marketStatus = {
          ...player.marketStatus,
          ...updates
        };
        if (interestedClub) {
          if (!player.marketStatus.interestedClubs.includes(interestedClub)) {
            player.marketStatus.interestedClubs.push(interestedClub);
          }
        }
      }
    },
    removeInterestedClub: (state, action: PayloadAction<{
      id: string;
      club: string;
    }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.marketStatus.interestedClubs = player.marketStatus.interestedClubs
          .filter(club => club !== action.payload.club);
      }
    },
    setFilters: (state, action: PayloadAction<Partial<PlayersState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action: PayloadAction<PlayersState['sort']>) => {
      state.sort = action.payload;
    }
  },
});

export const {
  setPlayers,
  addPlayer,
  updatePlayer,
  removePlayer,
  setLoading,
  setError,
  updatePlayerValue,
  updatePlayerWage,
  updatePlayerForm,
  addPlayerInjury,
  recoverFromInjury,
  updatePlayerStats,
  updatePlayerDevelopment,
  updateMarketStatus,
  removeInterestedClub,
  setFilters,
  resetFilters,
  setSort
} = playersSlice.actions;

export default playersSlice.reducer; 