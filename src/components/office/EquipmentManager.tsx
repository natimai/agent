import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { EquipmentItem } from '../../types/reputation';
import { formatCurrency } from '../../utils/format';
import { getAvailableEquipment, BASIC_EQUIPMENT, INTERMEDIATE_EQUIPMENT, ADVANCED_EQUIPMENT, PREMIUM_EQUIPMENT } from '../../data/equipment';

const EquipmentManager: React.FC = () => {
  const dispatch = useDispatch();
  const { treasury } = useSelector((state: RootState) => state.game);
  const { currentLevel } = useSelector((state: RootState) => state.office);
  const [selectedType, setSelectedType] = useState<EquipmentItem['type']>('OFFICE');

  const equipmentTypes = [
    { id: 'OFFICE', label: 'ציוד משרדי', icon: '🏢' },
    { id: 'TECH', label: 'טכנולוגיה', icon: '💻' },
    { id: 'TRAINING', label: 'ציוד אימון', icon: '⚽' },
    { id: 'MEDICAL', label: 'ציוד רפואי', icon: '🏥' },
  ];

  const handlePurchase = (item: EquipmentItem) => {
    if (treasury >= item.cost) {
      dispatch({ type: 'equipment/purchase', payload: item });
      dispatch({ type: 'game/updateTreasury', payload: -item.cost });
      dispatch({ 
        type: 'reputation/addEvent',
        payload: {
          source: 'EQUIPMENT_PURCHASE',
          amount: item.reputationBonus,
          description: `רכישת ${item.name}`,
          isPositive: true
        }
      });
    }
  };

  // מקבל את כל הציוד הזמין לרמת המשרד הנוכחית
  const allEquipment = [...BASIC_EQUIPMENT];
  if (currentLevel >= 2) allEquipment.push(...INTERMEDIATE_EQUIPMENT);
  if (currentLevel >= 3) allEquipment.push(...ADVANCED_EQUIPMENT);
  if (currentLevel >= 4) allEquipment.push(...PREMIUM_EQUIPMENT);

  // מסנן לפי הסוג הנבחר
  const filteredEquipment = allEquipment.filter(item => item.type === selectedType);

  return (
    <div className="equipment-manager">
      <h2 className="text-2xl font-bold mb-6">ניהול ציוד</h2>
      
      <div className="equipment-types mb-8">
        <div className="flex space-x-4">
          {equipmentTypes.map(type => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center p-4 rounded-lg ${
                selectedType === type.id ? 'bg-green-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedType(type.id as EquipmentItem['type'])}
            >
              <span className="text-2xl mr-2">{type.icon}</span>
              <span>{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="equipment-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(item => (
          <motion.div
            key={item.id}
            className="equipment-card bg-white p-6 rounded-lg shadow-md"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <div className="text-gray-600 mb-4">{item.description}</div>
            
            <div className="benefits space-y-2 mb-4">
              {Object.entries(item.benefits).map(([key, value]) => (
                <div key={key} className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">+</span>
                  <span>{formatBenefit(key, value)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-lg font-semibold">
                {formatCurrency(item.cost)}
              </div>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => handlePurchase(item)}
                disabled={treasury < item.cost}
              >
                רכוש
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              תחזוקה חודשית: {formatCurrency(item.monthlyMaintenance)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const formatBenefit = (key: string, value: number): string => {
  const benefitLabels: Record<string, string> = {
    staffEfficiency: 'יעילות צוות',
    playerDevelopment: 'התפתחות שחקנים',
    scoutingAccuracy: 'דיוק סקאוטינג',
    negotiationPower: 'כוח משא ומתן'
  };

  return `${benefitLabels[key]}: +${value}%`;
};

export default EquipmentManager; 
