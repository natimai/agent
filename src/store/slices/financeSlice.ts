import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, FinanceState } from '../../types/finance';

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'INCOME',
    category: 'AGENT_FEE',
    amount: 50000,
    description: 'עמלת סוכן - העברת שחקן',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'EXPENSE',
    category: 'OFFICE_RENT',
    amount: 5000,
    description: 'שכר דירה משרד - חודש נוכחי',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialState: FinanceState = {
  budget: 1000000,
  balance: 1000000,
  monthlyIncome: 100000,
  monthlyExpenses: 50000,
  transactions: initialTransactions,
  loading: false,
  error: null
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTransaction = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      state.transactions.push(newTransaction);
      
      if (newTransaction.type === 'INCOME') {
        state.balance += newTransaction.amount;
        state.budget += newTransaction.amount;
      } else {
        state.balance -= newTransaction.amount;
        state.budget -= newTransaction.amount;
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        if (transaction.type === 'INCOME') {
          state.balance -= transaction.amount;
          state.budget -= transaction.amount;
        } else {
          state.balance += transaction.amount;
          state.budget += transaction.amount;
        }
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      }
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      state.budget = action.payload;
    },
    updateMonthlyIncome: (state, action: PayloadAction<number>) => {
      state.monthlyIncome = action.payload;
    },
    updateMonthlyExpenses: (state, action: PayloadAction<number>) => {
      state.monthlyExpenses = action.payload;
    },
    processMonthlyFinances: (state) => {
      state.balance += state.monthlyIncome;
      state.balance -= state.monthlyExpenses;
      state.budget = state.balance;
      
      // הוספת העסקאות החודשיות
      state.transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'INCOME',
        category: 'AGENT_FEE',
        amount: state.monthlyIncome,
        description: 'הכנסה חודשית קבועה',
        date: new Date().toISOString(),
      });
      
      state.transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'EXPENSE',
        category: 'OFFICE_RENT',
        amount: state.monthlyExpenses,
        description: 'הוצאות חודשיות קבועות',
        date: new Date().toISOString(),
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
});

export const {
  addTransaction,
  removeTransaction,
  updateBalance,
  updateMonthlyIncome,
  updateMonthlyExpenses,
  processMonthlyFinances,
  setLoading,
  setError
} = financeSlice.actions;

export default financeSlice.reducer; 