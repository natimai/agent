import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedOfficeState, OfficeLevel, OfficeStats, MonthlyReport, OFFICE_LEVELS } from '../../types/office';
import { RootState } from '../store';

const initialState: ExtendedOfficeState = {
  level: OFFICE_LEVELS[0],
  experience: 0,
  lastUpgrade: new Date().toISOString(),
  stats: {
    totalTransfers: 0,
    successfulNegotiations: 0,
    failedNegotiations: 0,
    totalSpent: 0,
    totalEarned: 0,
    averageTransferValue: 0,
    bestTransfer: {
      playerId: '',
      playerName: '',
      amount: 0,
      date: new Date().toISOString()
    }
  },
  monthlyReports: []
};

const officeSlice = createSlice({
  name: 'office',
  initialState,
  reducers: {
    upgradeOffice: (state, action: PayloadAction<OfficeLevel>) => {
      state.level = action.payload;
      state.lastUpgrade = new Date().toISOString();
    },
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<OfficeStats>>) => {
      Object.assign(state.stats, action.payload);
    },
    addMonthlyReport: (state, action: PayloadAction<MonthlyReport>) => {
      state.monthlyReports.unshift(action.payload);
    },
    updateBestTransfer: (state, action: PayloadAction<OfficeStats['bestTransfer']>) => {
      if (action.payload.amount > state.stats.bestTransfer.amount) {
        state.stats.bestTransfer = action.payload;
      }
    }
  }
});

export const {
  upgradeOffice,
  addExperience,
  updateStats,
  addMonthlyReport,
  updateBestTransfer
} = officeSlice.actions;

export const selectOffice = (state: RootState) => state.office;
export const selectOfficeLevel = (state: RootState) => state.office.level;
export const selectOfficeStats = (state: RootState) => state.office.stats;
export const selectMonthlyReports = (state: RootState) => state.office.monthlyReports;

export default officeSlice.reducer; 