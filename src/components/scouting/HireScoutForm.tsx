import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { scoutManager } from '../../services/scoutManager';
import { Scout } from '../../types/scout';
import './HireScoutForm.css';

interface HireScoutFormProps {
  onHire: (scout: Scout) => void;
  onCancel: () => void;
}

const HireScoutForm: React.FC<HireScoutFormProps> = ({ onHire, onCancel }) => {
  const [level, setLevel] = useState(1);
  const { treasury } = useSelector((state: RootState) => state.game);
  const cost = scoutManager.calculateHiringCost(level);

  const handleHire = () => {
    try {
      const scout = scoutManager.generateNewScout(level);
      onHire(scout);
    } catch (error) {
      console.error('שגיאה בגיוס סקאוט:', error);
    }
  };

  return (
    <div className="hire-scout-form">
      <h3>גיוס סקאוט חדש</h3>
      
      <div className="form-group">
        <label>רמת הסקאוט:</label>
        <div className="level-selector">
          {[1, 2, 3, 4, 5].map(lvl => (
            <button
              key={lvl}
              className={`level-btn ${level === lvl ? 'selected' : ''}`}
              onClick={() => setLevel(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="scout-details">
        <div className="detail-item">
          <span>עלות העסקה:</span>
          <span className="cost">₪{cost.toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <span>תקציב זמין:</span>
          <span className={treasury >= cost ? 'sufficient' : 'insufficient'}>
            ₪{treasury.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="hire-btn"
          onClick={handleHire}
          disabled={treasury < cost}
        >
          גייס סקאוט
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </div>
  );
};

export default HireScoutForm; 