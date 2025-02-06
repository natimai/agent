import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfficeState } from '../types/office';

const initialState: OfficeState = {
  currentLevel: 1,
  stats: {
    totalTransfers: 0,
    totalCommissions: 0,
    activeNegotiations: 0,
    reputation: 0
  },
  monthlyReports: []
};

const officeSlice = createSlice({
  name: 'office',
  initialState,
  reducers: {
    upgradeOffice: (state) => {
      state.currentLevel += 1;
    },

    updateStats: (state, action: PayloadAction<Partial<OfficeState['stats']>>) => {
      state.stats = {
        ...state.stats,
        ...action.payload
      };
    },

    addMonthlyReport: (state, action: PayloadAction<OfficeState['monthlyReports'][0]>) => {
      state.monthlyReports.push(action.payload);
    },

    clearMonthlyReports: (state) => {
      state.monthlyReports = [];
    },

    setLevel: (state, action: PayloadAction<number>) => {
      state.currentLevel = action.payload;
    }
  }
});

export const { upgradeOffice, updateStats, addMonthlyReport, clearMonthlyReports, setLevel } = officeSlice.actions;
export default officeSlice.reducer; 