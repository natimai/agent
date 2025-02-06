import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaTools, FaMoneyBill, FaExclamationTriangle } from 'react-icons/fa';
import { RootState } from '../../store';
import { purchaseEquipment, performMaintenance } from '../../features/equipment/equipmentSlice';
import { getAvailableEquipment, calculateTotalMaintenance } from '../../data/equipment';
import { formatCurrency } from '../../utils/format';
import './EquipmentManager.css';

const EquipmentManager: React.FC = () => {
  const dispatch = useDispatch();
  const { ownedEquipment, maintenanceDue } = useSelector((state: RootState) => state.equipment);
  const { level: officeLevel, budget } = useSelector((state: RootState) => state.office);
  
  const availableEquipment = getAvailableEquipment(officeLevel);
  const monthlyMaintenance = calculateTotalMaintenance(ownedEquipment);
  
  const handlePurchase = (equipment: any) => {
    if (budget >= equipment.cost) {
      dispatch(purchaseEquipment(equipment));
    }
  };
  
  const handleMaintenance = (equipmentId: string) => {
    dispatch(performMaintenance(equipmentId));
  };
  
  return (
    <div className="equipment-manager">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="equipment-header"
      >
        <h2>ניהול ציוד</h2>
        <div className="maintenance-info">
          <FaMoneyBill />
          <span>עלות תחזוקה חודשית: {formatCurrency(monthlyMaintenance)}</span>
        </div>
      </motion.div>
      
      <div className="equipment-sections">
        {/* ציוד קיים */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="owned-equipment"
        >
          <h3>הציוד שלי</h3>
          <div className="equipment-grid">
            {ownedEquipment.map((item) => (
              <motion.div
                key={item.id}
                className="equipment-card"
                whileHover={{ scale: 1.02 }}
              >
                <h4>{item.name}</h4>
                <p className="equipment-description">{item.description}</p>
                <div className="equipment-stats">
                  <div className="condition-bar">
                    <div 
                      className="condition-fill"
                      style={{ 
                        width: `${item.condition}%`,
                        backgroundColor: item.condition < 30 ? '#ef4444' : 
                                       item.condition < 70 ? '#f59e0b' : '#22c55e'
                      }}
                    />
                  </div>
                  <span>מצב: {Math.round(item.condition)}%</span>
                </div>
                {item.condition < 50 && (
                  <button
                    className="maintenance-button"
                    onClick={() => handleMaintenance(item.id)}
                  >
                    <FaTools /> תחזוקה
                  </button>
                )}
                {maintenanceDue && item.condition < 30 && (
                  <div className="warning">
                    <FaExclamationTriangle />
                    <span>נדרשת תחזוקה!</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* ציוד זמין לרכישה */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="available-equipment"
        >
          <h3>ציוד זמין לרכישה</h3>
          <div className="equipment-grid">
            {availableEquipment
              .filter(item => !ownedEquipment.some(owned => owned.id === item.id))
              .map((item) => (
                <motion.div
                  key={item.id}
                  className="equipment-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4>{item.name}</h4>
                  <p className="equipment-description">{item.description}</p>
                  <div className="equipment-benefits">
                    {Object.entries(item.benefits).map(([key, value]) => (
                      <div key={key} className="benefit-item">
                        <span className="benefit-label">
                          {key === 'staffEfficiency' ? 'יעילות צוות' :
                           key === 'playerDevelopment' ? 'פיתוח שחקנים' :
                           key === 'scoutingAccuracy' ? 'דיוק סקאוטינג' :
                           key === 'negotiationPower' ? 'כוח משא ומתן' :
                           key === 'reputationBonus' ? 'בונוס מוניטין' : key}
                        </span>
                        <span className="benefit-value">+{value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="equipment-cost">
                    <span>מחיר: {formatCurrency(item.cost)}</span>
                    <span>תחזוקה: {formatCurrency(item.monthlyMaintenance)}/חודש</span>
                  </div>
                  <button
                    className="purchase-button"
                    onClick={() => handlePurchase(item)}
                    disabled={budget < item.cost}
                  >
                    {budget < item.cost ? 'אין מספיק תקציב' : 'רכישה'}
                  </button>
                </motion.div>
              ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default EquipmentManager; 