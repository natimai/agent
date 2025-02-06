import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentSkills {
  negotiation: number;
  scouting: number;
  management: number;
  networking: number;
  leadership: number;
  analysis: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  rewardType: 'MONEY' | 'REPUTATION' | 'SKILL_POINTS';
  rewardAmount: number;
}

interface AgentState {
  name: string;
  level: number;
  experience: number;
  reputation: number;
  skills: AgentSkills;
  achievements: Achievement[];
  specializations: string[];
  badges: string[];
  statistics: {
    totalTransfers: number;
    successfulNegotiations: number;
    failedNegotiations: number;
    totalEarnings: number;
    discoveredTalents: number;
    completedMissions: number;
  };
}

const initialState: AgentState = {
  name: '',
  level: 1,
  experience: 0,
  reputation: 0,
  skills: {
    negotiation: 1,
    scouting: 1,
    management: 1,
    networking: 1,
    leadership: 1,
    analysis: 1
  },
  achievements: [],
  specializations: [],
  badges: [],
  statistics: {
    totalTransfers: 0,
    successfulNegotiations: 0,
    failedNegotiations: 0,
    totalEarnings: 0,
    discoveredTalents: 0,
    completedMissions: 0
  }
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgentName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    gainExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      
      // בדיקת עלייה ברמה
      const experienceNeeded = state.level * 1000;
      while (state.experience >= experienceNeeded) {
        state.level += 1;
        state.experience -= experienceNeeded;
      }
    },

    gainReputation: (state, action: PayloadAction<number>) => {
      state.reputation += action.payload;
    },

    loseReputation: (state, action: PayloadAction<number>) => {
      state.reputation = Math.max(0, state.reputation - action.payload);
    },

    improveSkill: (state, action: PayloadAction<keyof AgentSkills>) => {
      const skill = action.payload;
      if (state.skills[skill] < 100) {
        state.skills[skill] += 1;
      }
    },

    addAchievement: (state, action: PayloadAction<Omit<Achievement, 'date'>>) => {
      state.achievements.push({
        ...action.payload,
        date: new Date().toISOString()
      });
    },

    addSpecialization: (state, action: PayloadAction<string>) => {
      if (!state.specializations.includes(action.payload)) {
        state.specializations.push(action.payload);
      }
    },

    awardBadge: (state, action: PayloadAction<string>) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },

    updateStatistics: (state, action: PayloadAction<Partial<AgentState['statistics']>>) => {
      state.statistics = {
        ...state.statistics,
        ...action.payload
      };
    },

    resetAgent: () => initialState
  }
});

export const {
  setAgentName,
  gainExperience,
  gainReputation,
  loseReputation,
  improveSkill,
  addAchievement,
  addSpecialization,
  awardBadge,
  updateStatistics,
  resetAgent
} = agentSlice.actions;

export default agentSlice.reducer; 