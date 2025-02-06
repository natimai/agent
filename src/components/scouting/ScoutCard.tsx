import React from 'react';
import { Scout } from '../../types/scout';
import './ScoutCard.css';

interface ScoutCardProps {
  scout: Scout;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const ScoutCard: React.FC<ScoutCardProps> = ({ 
  scout, 
  isActive, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      className={`scout-card ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="scout-header">
        <h3>{scout.name}</h3>
        <span className="scout-level">רמה {scout.level}</span>
      </div>

      <div className="scout-abilities">
        <div className="ability">
          <span>הערכת שחקנים</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.evaluation}%` }}
            />
          </div>
        </div>
        <div className="ability">
          <span>משא ומתן</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.negotiation}%` }}
            />
          </div>
        </div>
        <div className="ability">
          <span>פיתוח נוער</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.youth}%` }}
            />
          </div>
        </div>
      </div>

      <div className="scout-stats">
        <div className="stat">
          <span>משכורת חודשית</span>
          <span className="value">₪{scout.salary.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span>דיוק הערכות</span>
          <span className="value">{scout.stats.accuracy}%</span>
        </div>
        <div className="stat">
          <span>שחקנים שהתגלו</span>
          <span className="value">{scout.stats.successfulFinds}</span>
        </div>
      </div>

      {scout.currentMission && (
        <div className="mission-status">
          <span>במשימה</span>
          <div className="mission-progress">
            {/* נוסיף פה פרוגרס בר */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutCard; 