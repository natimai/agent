export interface Finance {
  balance: number;
  transactions: Transaction[];
  expenses: Expense[];
  income: Income[];
  investments: Investment[];
  financialGoals: FinancialGoal[];
  reports: FinancialReport[];
  budget: Budget;
  loans: Loan[];
}

export interface FinanceState {
  budget: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  relatedTo?: {
    type: 'PLAYER' | 'SCOUT' | 'EQUIPMENT' | 'OFFICE' | 'OTHER';
    id: string;
  };
}

export type TransactionCategory =
  | 'TRANSFER_FEE'
  | 'AGENT_FEE'
  | 'SALARY'
  | 'EQUIPMENT'
  | 'OFFICE_RENT'
  | 'UTILITIES'
  | 'MARKETING'
  | 'TRAVEL'
  | 'SCOUTING'
  | 'OTHER';

export interface Expense {
  id: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  nextDueDate: string;
  description: string;
  isAutomatic: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Income {
  id: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'ONE_TIME' | 'RECURRING';
  expectedDate: string;
  description: string;
  probability: number;
  source: string;
}

export interface Investment {
  id: string;
  type: 'OFFICE' | 'STAFF' | 'SCOUTING' | 'TRAINING' | 'MARKETING' | 'EQUIPMENT';
  level: number;
  cost: number;
  monthlyMaintenance: number;
  benefits: InvestmentBenefit[];
  roi: number; // Return on Investment
  paybackPeriod: number; // חודשים
}

export interface InvestmentBenefit {
  type: 'REPUTATION' | 'SCOUTING_RANGE' | 'TRAINING_QUALITY' | 'NEGOTIATION_POWER' | 'INCOME_BOOST';
  value: number;
  duration?: number; // חודשים, אם זמני
}

export interface FinancialGoal {
  id: string;
  type: 'BALANCE' | 'INCOME' | 'INVESTMENT' | 'REPUTATION';
  target: number;
  deadline: string;
  progress: number;
  isCompleted: boolean;
  reward?: {
    type: 'REPUTATION' | 'BONUS' | 'UNLOCK';
    value: number;
  };
}

export interface Budget {
  totalBudget: number;
  allocations: {
    [key in TransactionCategory]?: {
      amount: number;
      used: number;
      limit: number;
    };
  };
  period: 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  term: number; // חודשים
  startDate: string;
  monthlyPayment: number;
  remainingBalance: number;
  purpose: string;
  collateral?: string;
}

export interface FinancialReport {
  id: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  income: number;
  expenses: number;
  profit: number;
  breakdown: {
    category: TransactionCategory;
    amount: number;
    change: number; // שינוי באחוזים מהתקופה הקודמת
  }[];
  kpis: {
    profitMargin: number;
    cashFlow: number;
    roi: number;
    debtRatio?: number;
  };
} 