import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { purchaseEquipment } from '../../features/equipment/equipmentSlice';
import { formatCurrency } from '../../utils/format';
import { EquipmentItem } from '../../types/reputation';
import { FiShoppingCart, FiDollarSign, FiInfo, FiCheck } from 'react-icons/fi';
import { EQUIPMENT_ITEMS } from '../../data/equipment';

type EquipmentCategory = 'ALL' | 'OFFICE' | 'TECH' | 'TRAINING' | 'MEDICAL';

const categoryNames = {
  ALL: 'הכל',
  OFFICE: 'משרד',
  TECH: 'טכנולוגיה',
  TRAINING: 'אימון',
  MEDICAL: 'רפואה'
} as const;

const EquipmentStore: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory>('ALL');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const { ownedEquipment } = useSelector((state: RootState) => state.equipment);
  const { budget } = useSelector((state: RootState) => state.finance);

  const categories: EquipmentCategory[] = ['ALL', 'OFFICE', 'TECH', 'TRAINING', 'MEDICAL'];

  const filteredEquipment = EQUIPMENT_ITEMS.filter(item => 
    selectedCategory === 'ALL' || item.type === selectedCategory
  );

  const handlePurchase = (item: EquipmentItem) => {
    const numericBudget = Number(budget);
    if (!isNaN(numericBudget) && numericBudget >= item.cost) {
      dispatch(purchaseEquipment(item));
      setPurchaseSuccess(item.id);
      setTimeout(() => setPurchaseSuccess(null), 2000);
    }
  };

  const isOwned = (itemId: string) => {
    return ownedEquipment.some(item => item.id === itemId);
  };

  const canAfford = (cost: number) => {
    const numericBudget = Number(budget);
    return !isNaN(numericBudget) && numericBudget >= cost;
  };

  return (
    <div className="equipment-store">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">חנות ציוד</h2>
        <div className="budget flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <FiDollarSign className="text-green-600" />
          <div>
            <span className="text-gray-600 text-sm block">תקציב זמין:</span>
            <span className="font-semibold text-lg">{formatCurrency(Number(budget))}</span>
          </div>
        </div>
      </div>

      <div className="categories-filter flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {categoryNames[category]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEquipment.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <button
                    onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiInfo size={20} />
                  </button>
                </div>

                <AnimatePresence>
                  {showDetails === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="text-sm text-gray-600 space-y-2">
                        {Object.entries(item.benefits).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <span className="text-green-500 mr-2">+</span>
                            <span>{key}: <span className="font-medium">{value}%</span></span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-sm">מחיר:</span>
                    <span className="font-semibold text-lg mr-2">{formatCurrency(item.cost)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    תחזוקה: {formatCurrency(item.monthlyMaintenance)}/חודש
                  </div>
                </div>

                <div className="mt-4">
                  {isOwned(item.id) ? (
                    <button
                      disabled
                      className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FiCheck />
                      <span>בבעלותך</span>
                    </button>
                  ) : purchaseSuccess === item.id ? (
                    <motion.button
                      initial={{ backgroundColor: '#22c55e' }}
                      animate={{ backgroundColor: '#22c55e' }}
                      className="w-full py-2 px-4 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                      <FiCheck />
                      <span>נרכש בהצלחה!</span>
                    </motion.button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford(item.cost)}
                      className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        canAfford(item.cost)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart />
                      <span>רכוש</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EquipmentStore; 
