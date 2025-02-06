import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { upgradeOffice, handleEvent } from '../../store/slices/officeSlice';
import { OFFICE_LEVELS } from '../../types/office';
import { OfficeEvent, Sponsor, StaffMember } from '../../types/officeEvents';
import { formatCurrency } from '../../utils/format';
import './OfficeDashboard.css';

const OfficeDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentLevel,
    experience,
    stats,
    events,
    sponsors,
    staff,
    relationships,
    activeSponsors,
    monthlyReports
  } = useSelector((state: RootState) => state.office);
  const { treasury, reputation } = useSelector((state: RootState) => state.game);

  const currentOffice = OFFICE_LEVELS[currentLevel - 1];
  const nextOffice = OFFICE_LEVELS[currentLevel];
  
  const canUpgrade = nextOffice && 
    treasury >= nextOffice.upgradeCost && 
    reputation >= nextOffice.requiredReputation;

  const handleUpgrade = () => {
    if (canUpgrade) {
      dispatch(upgradeOffice({ cost: nextOffice.upgradeCost }));
    }
  };

  const handleEventOption = (eventId: string, optionId: string) => {
    dispatch(handleEvent({ eventId, optionId }));
  };

  return (
    <div className="office-dashboard">
      <motion.div 
        className="office-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>המשרד שלי - רמה {currentLevel}</h1>
        <div className="office-stats">
          <div className="stat">
            <h3>נסיון</h3>
            <p>{experience} נקודות</p>
          </div>
          <div className="stat">
            <h3>תקציב</h3>
            <p>{formatCurrency(treasury)}</p>
          </div>
          <div className="stat">
            <h3>מוניטין</h3>
            <p>{reputation} נקודות</p>
          </div>
        </div>
      </motion.div>

      <div className="office-content">
        <div className="office-section events-section">
          <h2>אירועים פעילים</h2>
          <div className="events-grid">
            {events
              .filter(event => !event.isHandled)
              .map((event: OfficeEvent) => (
                <motion.div 
                  key={event.id}
                  className="event-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-options">
                    {event.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleEventOption(event.id, option.id)}
                        className="event-option-btn"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="office-section sponsors-section">
          <h2>ספונסרים</h2>
          <div className="sponsors-grid">
            {sponsors.map((sponsor: Sponsor) => (
              <motion.div 
                key={sponsor.id}
                className={`sponsor-card ${sponsor.active ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>{sponsor.name}</h3>
                <p>סוג: {sponsor.type}</p>
                <p>תשלום חודשי: {formatCurrency(sponsor.monthlyPayment)}</p>
                <div className="sponsor-benefits">
                  {sponsor.benefits.reputationBonus && (
                    <span>בונוס מוניטין: +{sponsor.benefits.reputationBonus}%</span>
                  )}
                  {sponsor.benefits.negotiationBonus && (
                    <span>בונוס משא ומתן: +{sponsor.benefits.negotiationBonus}%</span>
                  )}
                  {sponsor.benefits.scoutingSpeedBonus && (
                    <span>בונוס מהירות סקאוטינג: +{sponsor.benefits.scoutingSpeedBonus}%</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="office-section staff-section">
          <h2>צוות המשרד</h2>
          <div className="staff-grid">
            {staff.map((member: StaffMember) => (
              <motion.div 
                key={member.id}
                className="staff-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>{member.name}</h3>
                <p>תפקיד: {member.role}</p>
                <p>רמה: {member.level}</p>
                <p>שכר: {formatCurrency(member.salary)}</p>
                <div className="staff-skills">
                  {Object.entries(member.skills).map(([skill, level]) => (
                    <div key={skill} className="skill-bar">
                      <span>{skill}</span>
                      <div className="skill-level" style={{ width: `${level}%` }} />
                    </div>
                  ))}
                </div>
                <p>שביעות רצון: {member.satisfaction}%</p>
                <p>ביצועים: {member.performance}%</p>
              </motion.div>
            ))}
          </div>
        </div>

        {nextOffice && (
          <motion.div 
            className="office-section upgrade-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>שדרוג משרד</h2>
            <div className="upgrade-info">
              <h3>רמה {currentLevel + 1}</h3>
              <p>עלות: {formatCurrency(nextOffice.upgradeCost)}</p>
              <p>דרישת מוניטין: {nextOffice.requiredReputation} נקודות</p>
              <div className="upgrade-benefits">
                <h4>יתרונות:</h4>
                <ul>
                  {Object.entries(nextOffice.benefits).map(([benefit, value]) => (
                    <li key={benefit}>{benefit}: +{value}%</li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={handleUpgrade}
                disabled={!canUpgrade}
                className={`upgrade-btn ${canUpgrade ? 'available' : ''}`}
              >
                שדרג משרד
              </button>
            </div>
          </motion.div>
        )}

        <div className="office-section reports-section">
          <h2>דוחות חודשיים</h2>
          <div className="reports-grid">
            {monthlyReports.slice(0, 3).map((report, index) => (
              <motion.div 
                key={index}
                className="report-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>{new Date(report.date).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</h3>
                <div className="report-details">
                  <div className="report-income">
                    <h4>הכנסות</h4>
                    <p>עמלות: {formatCurrency(report.income.commissions)}</p>
                    <p>ספונסרים: {formatCurrency(report.income.sponsorships)}</p>
                    <p>בונוסים: {formatCurrency(report.income.bonuses)}</p>
                  </div>
                  <div className="report-expenses">
                    <h4>הוצאות</h4>
                    <p>שכירות: {formatCurrency(report.expenses.rent)}</p>
                    <p>משכורות: {formatCurrency(report.expenses.salaries)}</p>
                    <p>הוצאות נוספות: {formatCurrency(report.expenses.misc)}</p>
                  </div>
                  <div className="report-total">
                    <h4>סה"כ</h4>
                    <p className={report.balance >= 0 ? 'positive' : 'negative'}>
                      {formatCurrency(report.balance)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDashboard; 