import React from 'react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">מאזן נוכחי</h3>
      <div className="text-3xl font-bold text-blue-600">
        ₪{balance.toLocaleString()}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
      </div>
    </div>
  );
};

export default BalanceCard; 