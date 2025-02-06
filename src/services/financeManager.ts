import store from '../store';
import { 
  addTransaction, 
  addExpense, 
  addIncome,
  makeInvestment,
  addReport,
  updateExpense
} from '../store/slices/financeSlice';
import { 
  Transaction, 
  Expense, 
  Income, 
  Investment,
  FinancialReport,
  TransactionCategory
} from '../types/finance';

class FinanceManager {
  // ניהול הוצאות אוטומטיות
  processRecurringExpenses() {
    const state = store.getState();
    const today = new Date();
    
    state.finance.expenses.forEach(expense => {
      if (expense.isAutomatic && new Date(expense.nextDueDate) <= today) {
        this.processExpense(expense);
        this.updateNextDueDate(expense);
      }
    });
  }

  // עיבוד הוצאה
  processExpense(expense: Expense) {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'EXPENSE',
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: new Date().toISOString()
    };
    
    store.dispatch(addTransaction(transaction));
  }

  // עדכון תאריך התשלום הבא
  private updateNextDueDate(expense: Expense) {
    const nextDate = new Date(expense.nextDueDate);
    
    switch (expense.frequency) {
      case 'DAILY':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'YEARLY':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    store.dispatch(updateExpense({
      ...expense,
      nextDueDate: nextDate.toISOString()
    }));
  }

  // יצירת דוח פיננסי
  generateFinancialReport(startDate: string, endDate: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
    const state = store.getState();
    const transactions = state.finance.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );

    const report: FinancialReport = {
      id: Date.now().toString(),
      period,
      startDate,
      endDate,
      income: 0,
      expenses: 0,
      profit: 0,
      breakdown: []
    };

    // חישוב סכומים לפי קטגוריות
    const categoryTotals = transactions.reduce((acc, t) => {
      const amount = t.amount;
      if (t.type === 'INCOME') {
        report.income += amount;
      } else {
        report.expenses += amount;
      }
      
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

    report.profit = report.income - report.expenses;
    report.breakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as TransactionCategory,
      amount
    }));

    store.dispatch(addReport(report));
    return report;
  }

  // חישוב החזר השקעה צפוי
  calculateROI(investment: Investment): number {
    const monthlyBenefit = investment.benefits.reduce((total, benefit) => {
      switch (benefit.type) {
        case 'REPUTATION':
          return total + (benefit.value * 1000);
        case 'SCOUTING_RANGE':
          return total + (benefit.value * 2000);
        case 'TRAINING_QUALITY':
          return total + (benefit.value * 1500);
        case 'NEGOTIATION_POWER':
          return total + (benefit.value * 3000);
        default:
          return total;
      }
    }, 0);

    const yearlyBenefit = monthlyBenefit * 12;
    const yearlyCost = investment.monthlyMaintenance * 12;
    
    return (yearlyBenefit - yearlyCost) / investment.cost * 100;
  }

  // הוספת הכנסה חדשה
  addNewIncome(income: Omit<Income, 'id'>) {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString()
    };
    store.dispatch(addIncome(newIncome));
  }

  // הוספת הוצאה חדשה
  addNewExpense(expense: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    store.dispatch(addExpense(newExpense));
  }
}

export const financeManager = new FinanceManager(); 