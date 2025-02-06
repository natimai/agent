import React from 'react';
import { Transaction } from '../../types/finance';

interface ExpensesChartProps {
  transactions: Transaction[];
}

const ExpensesChart = ({ transactions }: ExpensesChartProps) => {
  const calculateTotalsByCategory = () => {
    return transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  };

  const totals = calculateTotalsByCategory();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">התפלגות הוצאות</h3>
      <div className="space-y-4">
        {Object.entries(totals).map(([category, amount]) => (
          <div key={category}>
            <div className="flex justify-between text-sm mb-1">
              <span>{category}</span>
              <span>₪{amount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(amount / Object.values(totals).reduce((a, b) => a + b, 0)) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesChart; 