import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { removeEquipment } from '../../features/equipment/equipmentSlice';
import { formatCurrency } from '../../utils/format';
import { EquipmentItem } from '../../types/reputation';
import { FiTrash2, FiAlertCircle, FiTool, FiDollarSign } from 'react-icons/fi';

interface PurchasedItem {
  item: EquipmentItem;
  purchaseDate: string;
  condition: number;
}

interface PurchasedItems {
  [key: string]: PurchasedItem;
}

const PurchasedEquipment: React.FC = () => {
  const dispatch = useDispatch();
  const { ownedEquipment } = useSelector((state: RootState) => state.equipment);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemove = (itemId: string) => {
    setSelectedItem(itemId);
    setShowConfirmation(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      dispatch(removeEquipment(selectedItem));
      setShowConfirmation(false);
      setSelectedItem(null);
    }
  };

  const getConditionColor = (condition: number): string => {
    if (condition >= 80) return 'bg-green-500';
    if (condition >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConditionText = (condition: number): string => {
    if (condition >= 80) return 'מצב מצוין';
    if (condition >= 50) return 'מצב סביר';
    return 'דורש טיפול';
  };

  const totalMaintenance = ownedEquipment.reduce((total, item) => total + item.monthlyMaintenance, 0);

  return (
    <div className="purchased-equipment">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">ציוד קיים</h2>
        <div className="monthly-maintenance flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <FiDollarSign className="text-green-600" />
          <div>
            <span className="text-gray-600 text-sm block">תחזוקה חודשית:</span>
            <span className="font-semibold text-lg">{formatCurrency(totalMaintenance)}</span>
          </div>
        </div>
      </div>

      {ownedEquipment.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-lg"
        >
          <FiTool className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-600">אין ציוד במשרד כרגע</p>
          <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            רכוש ציוד חדש
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {ownedEquipment.map((item) => (
              <motion.div
                key={item.id}
                className="equipment-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`condition-indicator ${getConditionColor(item.condition)} w-3 h-3 rounded-full`} />
                    <span className="text-sm text-gray-500">{getConditionText(item.condition)}</span>
                  </div>
                </div>

                <div className="benefits space-y-2 mb-6 bg-gray-50 p-3 rounded-lg">
                  {Object.entries(item.benefits).map(([key, value]) => (
                    <div key={key} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">+</span>
                      <span className="text-gray-700">{key}: <span className="font-medium">{value}%</span></span>
                    </div>
                  ))}
                </div>

                <div className="condition mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">מצב הציוד</span>
                    <span className="text-sm font-medium">{item.condition}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-full rounded-full ${getConditionColor(item.condition)} transition-all duration-300`}
                      style={{ width: `${item.condition}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">תחזוקה: </span>
                    <span className="font-medium text-green-600">{formatCurrency(item.monthlyMaintenance)}</span>
                    <span className="text-gray-500">/חודש</span>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
                  >
                    <FiTrash2 />
                    <span>הסר</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal אישור מחיקה */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="text-2xl text-red-500" />
              <h3 className="text-xl font-semibold">אישור הסרת ציוד</h3>
            </div>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך להסיר את הפריט? פעולה זו לא ניתנת לביטול.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                הסר ציוד
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PurchasedEquipment; 