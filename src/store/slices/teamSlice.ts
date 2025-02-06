import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamStats } from '../../types/team';
import { RootState } from '../store';

interface TeamState {
  team: Team;
  stats: TeamStats;
}

const initialState: TeamState = {
  team: {
    id: '',
    name: '',
    shortName: '',
    city: '',
    stadium: '',
    reputation: 0,
    balance: 0,
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF'
    },
    league: '',
    division: 1,
    founded: 1900,
    rivals: [],
    board: {
      patience: 50,
      ambition: 50,
      expectations: {
        league: 0,
        cup: 0
      }
    },
    facilities: {
      stadium: 1,
      training: 1,
      youth: 1,
      medical: 1
    },
    staff: {
      scouts: [],
      coaches: [],
      medical: []
    }
  },
  stats: {
    league: {
      position: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    },
    cup: {
      round: '',
      played: 0,
      won: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    },
    season: {
      topScorer: {
        id: '',
        name: '',
        goals: 0
      },
      topAssister: {
        id: '',
        name: '',
        assists: 0
      },
      averageAttendance: 0,
      totalIncome: 0,
      totalExpenses: 0
    }
  }
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<Team>) => {
      state.team = action.payload;
    },
    updateTeam: (state, action: PayloadAction<Partial<Team>>) => {
      Object.assign(state.team, action.payload);
    },
    setTeamStats: (state, action: PayloadAction<TeamStats>) => {
      state.stats = action.payload;
    },
    updateTeamStats: (state, action: PayloadAction<Partial<TeamStats>>) => {
      Object.assign(state.stats, action.payload);
    },
    addStaffMember: (state, action: PayloadAction<{ type: 'scouts' | 'coaches' | 'medical', id: string }>) => {
      const { type, id } = action.payload;
      state.team.staff[type].push(id);
    },
    removeStaffMember: (state, action: PayloadAction<{ type: 'scouts' | 'coaches' | 'medical', id: string }>) => {
      const { type, id } = action.payload;
      state.team.staff[type] = state.team.staff[type].filter(staffId => staffId !== id);
    },
    updateFacilities: (state, action: PayloadAction<Partial<Team['facilities']>>) => {
      Object.assign(state.team.facilities, action.payload);
    }
  }
});

export const {
  setTeam,
  updateTeam,
  setTeamStats,
  updateTeamStats,
  addStaffMember,
  removeStaffMember,
  updateFacilities
} = teamSlice.actions;

export const selectTeam = (state: RootState) => state.team.team;
export const selectTeamStats = (state: RootState) => state.team.stats;
export const selectFacilities = (state: RootState) => state.team.team.facilities;
export const selectStaff = (state: RootState) => state.team.team.staff;

export default teamSlice.reducer; 