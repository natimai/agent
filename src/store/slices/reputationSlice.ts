import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReputationEvent, ReputationLevel } from '../../types/reputation';

interface ReputationState {
  points: number;
  level: ReputationLevel;
  events: ReputationEvent[];
}

const initialState: ReputationState = {
  points: 0,
  level: {
    level: 1,
    name: 'סוכן מתחיל',
    minPoints: 0,
    benefits: {
      negotiationBonus: 0,
      transferFeeBonus: 0,
      playerInterestBonus: 0,
      sponsorshipBonus: 0,
    },
    unlocks: [],
  },
  events: [],
};

const reputationSlice = createSlice({
  name: 'reputation',
  initialState,
  reducers: {
    addReputationPoints: (state, action: PayloadAction<number>) => {
      state.points += action.payload;
    },
    
    addReputationEvent: (state, action: PayloadAction<ReputationEvent>) => {
      state.events.push(action.payload);
      state.points += action.payload.amount;
    },
    
    setReputationLevel: (state, action: PayloadAction<ReputationLevel>) => {
      state.level = action.payload;
    },
    
    clearReputationEvents: (state) => {
      state.events = [];
    },
  },
});

export const {
  addReputationPoints,
  addReputationEvent,
  setReputationLevel,
  clearReputationEvents,
} = reputationSlice.actions;

export default reputationSlice.reducer; 