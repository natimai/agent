import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { upgradeOffice } from '../../store/slices/officeSlice';
import { OFFICE_LEVELS } from '../../data/office';
import PageWrapper from '../../components/common/PageWrapper';
import EquipmentManager from '../../components/office/EquipmentManager';
import PurchasedEquipment from '../../components/office/PurchasedEquipment';
import ReputationEvents from '../../components/reputation/ReputationEvents';
import { formatCurrency } from '../../utils/format';
import { FaTrophy, FaChartLine, FaHandshake, FaUsers, FaBuilding, FaStar } from 'react-icons/fa';
import './OfficeDashboard.css';

const OfficeDashboard = () => {
  const dispatch = useDispatch();
  const { currentLevel, stats } = useSelector((state: RootState) => state.office);
  const { treasury, reputation } = useSelector((state: RootState) => state.game);
  
  const currentOffice = OFFICE_LEVELS[currentLevel - 1];
  const nextOffice = OFFICE_LEVELS[currentLevel];
  const canUpgrade = treasury >= nextOffice?.upgradeCost && reputation >= nextOffice?.requiredReputation;

  const handleUpgrade = () => {
    if (canUpgrade && nextOffice) {
      dispatch(upgradeOffice({ cost: nextOffice.upgradeCost }));
    }
  };

  return (
    <PageWrapper>
      <div className="office-dashboard">
        <div className="office-container">
          {/* כותרת ופרטי משרד */}
          <div className="office-header">
            <div className="header-content">
              <div className="office-info">
                <div className="office-icon">
                  <FaBuilding />
                </div>
                <div className="office-details">
                  <h1>{currentOffice.name}</h1>
                  <p>{currentOffice.description}</p>
                </div>
              </div>
              <div className="office-stats">
                <div className="stat-box">
                  <div className="stat-label">תקציב</div>
                  <div className="stat-value">{formatCurrency(treasury)}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">מוניטין</div>
                  <div className="stat-value">{reputation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* סטטיסטיקות */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon yellow">
                  <FaTrophy />
                </div>
                <h3 className="stat-title">העברות שהושלמו</h3>
              </div>
              <div className="stat-value">{stats.totalTransfers}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon green">
                  <FaChartLine />
                </div>
                <h3 className="stat-title">סך עמלות</h3>
              </div>
              <div className="stat-value">{formatCurrency(stats.totalCommissions)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon blue">
                  <FaHandshake />
                </div>
                <h3 className="stat-title">משא ומתן פעיל</h3>
              </div>
              <div className="stat-value">{stats.activeNegotiations}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon purple">
                  <FaUsers />
                </div>
                <h3 className="stat-title">מוניטין</h3>
              </div>
              <div className="stat-value">{stats.reputation}</div>
            </div>
          </div>

          {/* שדרוג משרד */}
          {nextOffice && (
            <div className="upgrade-section">
              <div className="upgrade-header">
                <div className="upgrade-icon">
                  <FaStar />
                </div>
                <h2 className="upgrade-title">שדרוג משרד</h2>
              </div>
              <div className="upgrade-grid">
                <div className="upgrade-box">
                  <h3>דרישות שדרוג</h3>
                  <div className="requirements-list">
                    <div className={`requirement-item ${treasury >= nextOffice.upgradeCost ? 'met' : 'unmet'}`}>
                      <span className="ml-2">•</span>
                      <span>תקציב: {formatCurrency(nextOffice.upgradeCost)}</span>
                    </div>
                    <div className={`requirement-item ${reputation >= nextOffice.requiredReputation ? 'met' : 'unmet'}`}>
                      <span className="ml-2">•</span>
                      <span>מוניטין: {nextOffice.requiredReputation}</span>
                    </div>
                  </div>
                </div>

                <div className="upgrade-box">
                  <h3>יתרונות</h3>
                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="ml-2">•</span>
                      <span>בונוס משא ומתן: +{nextOffice.benefits.negotiationBonus}%</span>
                    </div>
                    <div className="benefit-item">
                      <span className="ml-2">•</span>
                      <span>בונוס מהירות סקאוטינג: +{nextOffice.benefits.scoutingSpeedBonus}%</span>
                    </div>
                    <div className="benefit-item">
                      <span className="ml-2">•</span>
                      <span>בונוס מוניטין: +{nextOffice.benefits.reputationBonus}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleUpgrade}
                    disabled={!canUpgrade}
                    className="upgrade-button"
                  >
                    שדרג למשרד רמה {currentLevel + 1}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ציוד ומוניטין */}
          <div className="content-grid">
            <div className="equipment-section">
              <div className="content-card">
                <PurchasedEquipment />
              </div>
              <div className="content-card">
                <EquipmentManager />
              </div>
            </div>
            <div className="content-card">
              <ReputationEvents />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OfficeDashboard; 