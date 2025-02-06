import React from 'react';
import { FinancialGoal } from '../../types/finance';

interface FinancialGoalsProps {
  goals: FinancialGoal[];
}

const FinancialGoals = ({ goals }: FinancialGoalsProps) => {
  const getGoalTypeText = (type: FinancialGoal['type']) => {
    const typeMap = {
      'BALANCE': 'יעד מאזן',
      'INCOME': 'יעד הכנסה',
      'INVESTMENT': 'יעד השקעות'
    };
    return typeMap[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{getGoalTypeText(goal.type)}</h4>
                <p className="text-sm text-gray-500">
                  יעד: ₪{goal.target.toLocaleString()}
                </p>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">תאריך יעד:</div>
                <div>{new Date(goal.deadline).toLocaleDateString('he-IL')}</div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(goal.progress)}%
                  </span>
                </div>
                {goal.isCompleted && (
                  <div className="text-xs font-semibold inline-block text-green-600">
                    הושלם!
                  </div>
                )}
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${goal.progress}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialGoals; 