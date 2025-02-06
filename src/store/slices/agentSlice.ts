import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AgentState {
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
  stats: {
    totalDeals: number;
    successfulDeals: number;
    failedDeals: number;
    totalEarnings: number;
  };
}

const initialState: AgentState = {
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
  stats: {
    totalDeals: 0,
    successfulDeals: 0,
    failedDeals: 0,
    totalEarnings: 0,
  },
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    gainExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      // בדיקת עלייה ברמה
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
    updateStats: (state, action: PayloadAction<Partial<AgentState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
});

export const { gainExperience, updateReputation, improveSkill, addAchievement, updateStats } = agentSlice.actions;
export default agentSlice.reducer; 