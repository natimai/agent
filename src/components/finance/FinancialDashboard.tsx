import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BalanceCard from './BalanceCard';
import TransactionsTable from './TransactionsTable';
import ExpensesChart from './ExpensesChart';
import InvestmentsOverview from './InvestmentsOverview';
import FinancialGoals from './FinancialGoals';

const FinancialDashboard = () => {
  const { 
    balance, 
    transactions, 
    investments,
    financialGoals 
  } = useSelector((state: RootState) => state.finance);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">ניהול פיננסי</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BalanceCard balance={balance} />
        <ExpensesChart transactions={transactions} />
        <InvestmentsOverview investments={investments} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">יעדים פיננסיים</h2>
        <FinancialGoals goals={financialGoals} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">היסטוריית עסקאות</h2>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
};

export default FinancialDashboard; 