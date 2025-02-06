import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TreasuryState, RootState } from '../../types/types';

const initialState: TreasuryState = {
  balance: 1000000,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  lastUpdate: new Date().toISOString()
};

const treasurySlice = createSlice({
  name: 'treasury',
  initialState,
  reducers: {
    updateTreasury: (state, action: PayloadAction<Partial<TreasuryState>>) => {
      Object.assign(state, action.payload);
    },
    addIncome: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      state.monthlyIncome += action.payload;
    },
    addExpense: (state, action: PayloadAction<number>) => {
      state.balance -= action.payload;
      state.monthlyExpenses += action.payload;
    },
    resetMonthlyStats: (state) => {
      state.monthlyIncome = 0;
      state.monthlyExpenses = 0;
      state.lastUpdate = new Date().toISOString();
    }
  }
});

export const {
  updateTreasury,
  addIncome,
  addExpense,
  resetMonthlyStats
} = treasurySlice.actions;

export const selectTreasury = (state: RootState) => state.treasury;
export const selectBalance = (state: RootState) => state.treasury.balance;
export const selectMonthlyIncome = (state: RootState) => state.treasury.monthlyIncome;
export const selectMonthlyExpenses = (state: RootState) => state.treasury.monthlyExpenses;

export default treasurySlice.reducer; 