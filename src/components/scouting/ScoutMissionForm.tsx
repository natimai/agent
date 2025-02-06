import React, { useState } from 'react';
import { Scout } from '../../types/scout';
import { Country } from '../../types/country';
import { scoutManager } from '../../services/scoutManager';
import './ScoutMissionForm.css';

interface ScoutMissionFormProps {
  scout: Scout;
  onSubmit: () => void;
  onCancel: () => void;
}

const ScoutMissionForm = ({ scout, onSubmit, onCancel }: ScoutMissionFormProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [duration, setDuration] = useState(30);
  const [costs, setCosts] = useState<ScoutMissionCosts | null>(null);

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    if (countryId && duration) {
      const missionCosts = scoutManager.calculateMissionCosts(scout, countryId, duration);
      setCosts(missionCosts);
    }
  };

  const handleDurationChange = (days: number) => {
    setDuration(days);
    if (selectedCountry && days) {
      const missionCosts = scoutManager.calculateMissionCosts(scout, selectedCountry, days);
      setCosts(missionCosts);
    }
  };

  const handleSubmit = () => {
    if (!selectedCountry || !duration) return;
    
    try {
      scoutManager.startMission(scout, selectedCountry, duration);
      onSubmit();
    } catch (error) {
      // טיפול בשגיאות
    }
  };

  return (
    <div className="scout-mission-form">
      <h3>שליחת סקאוט למשימה</h3>
      
      <div className="form-group">
        <label>בחר מדינת יעד:</label>
        <select value={selectedCountry} onChange={e => handleCountryChange(e.target.value)}>
          <option value="">בחר מדינה</option>
          {countries.map(country => (
            <option 
              key={country.id} 
              value={country.id}
              className={scout.preferredCountries.includes(country.id) ? 'preferred' : ''}
            >
              {country.name}
              {scout.preferredCountries.includes(country.id) ? ' (מועדף)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>משך המשימה (ימים):</label>
        <input
          type="range"
          min={7}
          max={90}
          value={duration}
          onChange={e => handleDurationChange(Number(e.target.value))}
        />
        <span>{duration} ימים</span>
      </div>

      {costs && (
        <div className="mission-costs">
          <h4>עלויות משוערות:</h4>
          <div className="costs-breakdown">
            <div className="cost-item">
              <span>שכר:</span>
              <span>₪{costs.salary.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span>עלויות תפעול:</span>
              <span>₪{costs.operationalCosts.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span>עלויות נסיעה:</span>
              <span>₪{costs.travelCosts.toLocaleString()}</span>
            </div>
            <div className="cost-item total">
              <span>סה"כ:</span>
              <span>₪{costs.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!selectedCountry || !duration}
        >
          שלח למשימה
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </div>
  );
};

export default ScoutMissionForm; 