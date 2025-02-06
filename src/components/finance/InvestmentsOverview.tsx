import React from 'react';
import { Investment } from '../../types/finance';
import { financeManager } from '../../services/financeManager';

interface InvestmentsOverviewProps {
  investments: Investment[];
}

const InvestmentsOverview = ({ investments }: InvestmentsOverviewProps) => {
  const getInvestmentTypeText = (type: Investment['type']) => {
    const typeMap = {
      'OFFICE': 'משרד',
      'STAFF': 'צוות',
      'SCOUTING': 'סקאוטינג',
      'TRAINING': 'אימון',
      'MARKETING': 'שיווק'
    };
    return typeMap[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">השקעות פעילות</h3>
      <div className="space-y-4">
        {investments.map((investment) => (
          <div key={investment.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{getInvestmentTypeText(investment.type)}</h4>
                <p className="text-sm text-gray-500">רמה {investment.level}</p>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">תחזוקה חודשית:</div>
                <div className="font-medium">₪{investment.monthlyMaintenance.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-500">החזר השקעה צפוי:</div>
              <div className="font-medium text-green-600">
                {financeManager.calculateROI(investment).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentsOverview; 