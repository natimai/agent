import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { upgradeOffice } from '../../store/office';
import { OFFICE_LEVELS } from '../../data/office';
import { formatCurrency } from '../../utils/format';

const OfficeUpgrade: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLevel } = useSelector((state: RootState) => state.office);
  const { treasury } = useSelector((state: RootState) => state.game);
  const { currentPoints: reputation } = useSelector((state: RootState) => state.reputation);

  const currentOffice = OFFICE_LEVELS[currentLevel - 1];
  const nextOffice = currentLevel < OFFICE_LEVELS.length ? OFFICE_LEVELS[currentLevel] : null;

  const canUpgrade = nextOffice && 
    treasury >= nextOffice.requiredBudget && 
    reputation >= nextOffice.requiredReputation;

  const handleUpgrade = () => {
    if (canUpgrade) {
      dispatch(upgradeOffice());
      // הוספת אירוע מוניטין
      dispatch({
        type: 'reputation/addEvent',
        payload: {
          id: `office-upgrade-${Date.now()}`,
          source: 'OFFICE_UPGRADE',
          amount: nextOffice.reputationBonus,
          description: `שדרוג למשרד ${nextOffice.name}`,
          date: new Date().toISOString(),
          isPositive: true
        }
      });
      // עדכון התקציב
      dispatch({
        type: 'game/updateTreasury',
        payload: -nextOffice.requiredBudget
      });
    }
  };

  if (!nextOffice) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">משרד ברמה מקסימלית</h2>
        <p className="text-gray-600">הגעת לרמה הגבוהה ביותר של המשרד!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">שדרוג משרד</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{nextOffice.name}</h3>
          <p className="text-gray-600 mb-4">{nextOffice.description}</p>
          
          <div className="requirements space-y-2">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${treasury >= nextOffice.requiredBudget ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 ml-2">תקציב נדרש:</span>
              <span className="font-semibold">{formatCurrency(nextOffice.requiredBudget)}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${reputation >= nextOffice.requiredReputation ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 ml-2">מוניטין נדרש:</span>
              <span className="font-semibold">{nextOffice.requiredReputation}</span>
            </div>
          </div>
        </div>

        <div className="benefits">
          <h4 className="font-semibold mb-2">שיפורים:</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">+</span>
              <span>מקסימום שחקנים: {nextOffice.maxPlayers - currentOffice.maxPlayers}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">+</span>
              <span>מקסימום סקאוטים: {nextOffice.maxScouts - currentOffice.maxScouts}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">+</span>
              <span>בונוס עמלות: {nextOffice.commissionBonus - currentOffice.commissionBonus}%</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">+</span>
              <span>בונוס מוניטין: {nextOffice.reputationBonus - currentOffice.reputationBonus}%</span>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold ${
          canUpgrade ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        whileHover={canUpgrade ? { scale: 1.02 } : {}}
        whileTap={canUpgrade ? { scale: 0.98 } : {}}
        onClick={handleUpgrade}
        disabled={!canUpgrade}
      >
        שדרג משרד
      </motion.button>
    </div>
  );
};

export default OfficeUpgrade; 