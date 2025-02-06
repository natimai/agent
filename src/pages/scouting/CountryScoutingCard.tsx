import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Country } from '../../types/country';
import { Scout } from '../../types/scout';
import './CountryScoutingCard.css';

interface CountryScoutingCardProps {
  country: Country;
  scout: Scout;
  onStartMission: (countryId: string, duration: number) => void;
}

const CountryScoutingCard = ({ country, scout, onStartMission }: CountryScoutingCardProps) => {
  const [duration, setDuration] = useState(30);
  const { treasury } = useSelector((state: RootState) => state.game);
  const isPreferredCountry = scout.preferredCountries.includes(country.id);
  const missionCost = country.scoutingCost * (duration / 30);

  const getEfficiencyBonus = () => {
    let bonus = 1;
    if (isPreferredCountry) bonus += 0.2;
    if (scout.specialties.some(pos => country.specialties.includes(pos))) bonus += 0.1;
    return bonus;
  };

  return (
    <div className={`country-card ${isPreferredCountry ? 'preferred' : ''}`}>
      <div className="country-header">
        <h3>{country.name}</h3>
        <div className="cost-tag">₪{country.scoutingCost.toLocaleString()} / חודש</div>
      </div>

      <div className="country-specialties">
        <h4>התמחויות:</h4>
        <div className="specialty-tags">
          {country.specialties.map(pos => (
            <span 
              key={pos} 
              className={`specialty-tag ${scout.specialties.includes(pos) ? 'matching' : ''}`}
            >
              {pos}
            </span>
          ))}
        </div>
      </div>

      <p className="country-style">{country.style.description}</p>

      {isPreferredCountry && (
        <div className="bonus-info">
          <span className="bonus-tag">+20% יעילות</span>
          <p>מדינה מועדפת על הסקאוט</p>
        </div>
      )}

      <div className="mission-controls">
        <div className="duration-control">
          <label>משך המשימה:</label>
          <div className="duration-slider">
            <input
              type="range"
              min={7}
              max={90}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
            <span>{duration} ימים</span>
          </div>
        </div>

        <div className="mission-summary">
          <div className="summary-item">
            <span>עלות כוללת:</span>
            <span>₪{Math.floor(missionCost).toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span>יעילות משוערת:</span>
            <span>{Math.floor(getEfficiencyBonus() * 100)}%</span>
          </div>
        </div>

        <button 
          className="start-mission-btn"
          onClick={() => onStartMission(country.id, duration)}
          disabled={missionCost > treasury}
        >
          התחל משימה
        </button>
      </div>
    </div>
  );
};

export default CountryScoutingCard; 