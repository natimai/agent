import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AgentState {
  id: string;
  name: string;
  level: number;
  experience: number;
  reputation: number;
  skills: {
    negotiation: number;
    scouting: number;
    management: number;
    marketing: number;
  };
  achievements: string[];
  statistics: {
    totalDeals: number;
    successfulDeals: number;
    failedDeals: number;
    totalEarnings: number;
    activeNegotiations: number;
    averageCommission: number;
    bestDeal: {
      amount: number;
      playerName: string;
      date: string;
    };
  };
  specializations: {
    id: string;
    name: string;
    level: number;
    description: string;
  }[];
  badges: {
    id: string;
    title: string;
    description: string;
    date: string;
    rewardAmount: number;
    rewardType: 'MONEY' | 'REPUTATION' | 'EXPERIENCE';
  }[];
}

const initialState: AgentState = {
  id: '1',
  name: 'סוכן חדש',
  level: 1,
  experience: 0,
  reputation: 50,
  skills: {
    negotiation: 1,
    scouting: 1,
    management: 1,
    marketing: 1,
  },
  achievements: [],
  statistics: {
    totalDeals: 0,
    successfulDeals: 0,
    failedDeals: 0,
    totalEarnings: 0,
    activeNegotiations: 0,
    averageCommission: 0,
    bestDeal: {
      amount: 0,
      playerName: '',
      date: new Date().toISOString()
    }
  },
  specializations: [],
  badges: []
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    gainExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      if (state.experience >= state.level * 1000) {
        state.level += 1;
        state.experience = 0;
      }
    },
    updateReputation: (state, action: PayloadAction<number>) => {
      state.reputation = Math.max(0, Math.min(100, state.reputation + action.payload));
    },
    improveSkill: (state, action: PayloadAction<keyof AgentState['skills']>) => {
      if (state.skills[action.payload] < 10) {
        state.skills[action.payload] += 1;
      }
    },
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    },
    updateStats: (state, action: PayloadAction<Partial<AgentState['statistics']>>) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    addSpecialization: (state, action: PayloadAction<AgentState['specializations'][0]>) => {
      state.specializations.push(action.payload);
    },
    addBadge: (state, action: PayloadAction<AgentState['badges'][0]>) => {
      state.badges.push(action.payload);
    }
  },
});

export const { 
  gainExperience, 
  updateReputation, 
  improveSkill, 
  addAchievement, 
  updateStats,
  addSpecialization,
  addBadge
} = agentSlice.actions;

export default agentSlice.reducer; 