import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReputationEvent } from '../types/reputation';

interface ReputationState {
  currentPoints: number;
  events: ReputationEvent[];
}

const initialState: ReputationState = {
  currentPoints: 0,
  events: []
};

const reputationSlice = createSlice({
  name: 'reputation',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<ReputationEvent>) => {
      const event = action.payload;
      state.events.push(event);
      state.currentPoints += event.isPositive ? event.amount : -event.amount;
    },
    
    removeEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        state.currentPoints -= event.isPositive ? event.amount : -event.amount;
        state.events = state.events.filter(e => e.id !== eventId);
      }
    },

    setPoints: (state, action: PayloadAction<number>) => {
      state.currentPoints = action.payload;
    },

    clearEvents: (state) => {
      state.events = [];
    }
  }
});

export const { addEvent, removeEvent, setPoints, clearEvents } = reputationSlice.actions;
export default reputationSlice.reducer; 