import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { EquipmentItem } from '../../types/reputation';
import { EQUIPMENT_ITEMS } from '../../data/equipment';
import { formatCurrency } from '../../utils/format';
import { FiHome, FiPackage, FiWatch, FiDollarSign, FiStar, FiInfo, FiCheck, FiAlertCircle, FiShare2, FiBell, FiShoppingCart, FiX, FiMonitor, FiActivity, FiHeart } from 'react-icons/fi';
import PageWrapper from '../../components/common/PageWrapper';
import './AssetsStore.css';

const AssetsStore: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState<'OFFICE' | 'TECH' | 'TRAINING' | 'MEDICAL'>('OFFICE');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<EquipmentItem | null>(null);

  const { reputation, level } = useSelector((state: RootState) => state.agent as { reputation: number; level: number });
  const { balance: budget } = useSelector((state: RootState) => state.finance);
  const { ownedEquipment } = useSelector((state: RootState) => state.equipment);

  const equipmentTypes = [
    { id: 'OFFICE', name: 'ציוד משרדי', icon: FiHome },
    { id: 'TECH', name: 'טכנולוגיה', icon: FiMonitor },
    { id: 'TRAINING', name: 'אימונים', icon: FiActivity },
    { id: 'MEDICAL', name: 'רפואה', icon: FiHeart }
  ] as const;

  const getEquipmentByType = () => {
    return EQUIPMENT_ITEMS.filter(item => item.type === selectedType);
  };

  const handlePurchase = (equipment: EquipmentItem) => {
    setShowConfirmation(equipment);
  };

  const confirmPurchase = () => {
    if (!showConfirmation) return;

    dispatch({ type: 'equipment/purchaseEquipment', payload: showConfirmation });
    setPurchaseSuccess(showConfirmation.id);
    setShowConfirmation(null);
    setTimeout(() => setPurchaseSuccess(null), 2000);
  };

  const isOwned = (equipmentId: string) => {
    return ownedEquipment.some(item => item.id === equipmentId);
  };

  const canAfford = (cost: number) => {
    return Number(budget) >= cost;
  };

  const meetsRequirements = (equipment: EquipmentItem) => {
    return level >= equipment.minOfficeLevel;
  };

  return (
    <PageWrapper>
      <div className="assets-store">
        {/* Header */}
        <div className="header">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">חנות ציוד</h1>
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              <FiDollarSign />
              <span>{formatCurrency(Number(budget))}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FiShare2 className="text-xl" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FiBell className="text-xl" />
            </button>
          </div>
        </div>

        {/* Equipment Type Filters */}
        <div className="asset-types-grid">
          {equipmentTypes.map(type => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`asset-type-button ${selectedType === type.id ? 'active' : ''}`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <type.icon className="text-3xl" />
              <span className="text-base font-medium">{type.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="assets-grid">
          <AnimatePresence>
            {getEquipmentByType().map(equipment => (
              <motion.div
                key={equipment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="asset-card"
              >
                <div className="asset-image">
                  <div className="placeholder">
                    {equipment.type === 'OFFICE' && <FiHome />}
                    {equipment.type === 'TECH' && <FiMonitor />}
                    {equipment.type === 'TRAINING' && <FiActivity />}
                    {equipment.type === 'MEDICAL' && <FiHeart />}
                  </div>
                  
                  <button className={`like-button ${isOwned(equipment.id) ? 'active' : ''}`}>
                    <FiStar className="text-xl" />
                  </button>
                </div>

                <div className="asset-info">
                  <h3 className="asset-name">{equipment.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{equipment.description}</p>
                  
                  <div className="benefits-list">
                    {Object.entries(equipment.benefits).map(([key, value]) => (
                      <div key={key} className="text-sm text-gray-600">
                        <span className="text-green-600">+{value}%</span> {key}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="asset-price">
                        {formatCurrency(equipment.cost).replace('₪', '')}
                      </span>
                      <div className="text-sm text-gray-500">
                        תחזוקה: {formatCurrency(equipment.monthlyMaintenance)}/חודש
                      </div>
                    </div>
                    {!isOwned(equipment.id) && (
                      <button
                        onClick={() => handlePurchase(equipment)}
                        disabled={!canAfford(equipment.cost) || !meetsRequirements(equipment)}
                        className="purchase-button"
                      >
                        {isOwned(equipment.id) ? (
                          <>
                            <FiCheck />
                            <span>בבעלותך</span>
                          </>
                        ) : !canAfford(equipment.cost) ? (
                          <>
                            <FiX />
                            <span>אין מספיק תקציב</span>
                          </>
                        ) : !meetsRequirements(equipment) ? (
                          <>
                            <FiX />
                            <span>נדרשת רמה {equipment.minOfficeLevel}</span>
                          </>
                        ) : (
                          <>
                            <FiShoppingCart />
                            <span>רכוש</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && (
        <div className="purchase-modal">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content"
          >
            <div className="modal-body">
              <div className="flex items-center gap-3 mb-4">
                <FiAlertCircle className="text-2xl text-green-500" />
                <h3 className="text-xl font-semibold">אישור רכישה</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  האם אתה בטוח שברצונך לרכוש את {showConfirmation.name}?
                </p>
                <div className="details-box">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">מחיר:</span>
                    <span className="font-semibold">{formatCurrency(showConfirmation.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">תחזוקה חודשית:</span>
                    <span className="font-semibold">{formatCurrency(showConfirmation.monthlyMaintenance)}</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="modal-button cancel-button"
                >
                  <FiX />
                  <span>ביטול</span>
                </button>
                <button
                  onClick={confirmPurchase}
                  className="modal-button confirm-button"
                >
                  <FiShoppingCart />
                  <span>אשר רכישה</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
};

export default AssetsStore; 