import React from 'react';
import { Scout } from '../../types/scout';
import { countries } from '../../data/countries';
import './ScoutCard.css';

interface ScoutCardProps {
  scout: Scout;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const ScoutCard = ({ scout, isActive, isSelected, onSelect }: ScoutCardProps) => {
  return (
    <div className={`scout-card ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}>
      <div className="scout-header">
        <h3>{scout.name}</h3>
        <span className="scout-level">רמה {scout.level}</span>
      </div>

      <div className="scout-specialties">
        <h4>התמחויות:</h4>
        <div className="specialty-tags">
          {scout.specialties.map(pos => (
            <span key={pos} className="specialty-tag">{pos}</span>
          ))}
        </div>
      </div>

      <div className="scout-abilities">
        <div className="ability">
          <span>הערכת שחקנים:</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.evaluation}%` }}
            />
          </div>
        </div>
        <div className="ability">
          <span>משא ומתן:</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.negotiation}%` }}
            />
          </div>
        </div>
        <div className="ability">
          <span>איתור צעירים:</span>
          <div className="ability-bar">
            <div 
              className="ability-fill"
              style={{ width: `${scout.abilities.youth}%` }}
            />
          </div>
        </div>
      </div>

      <div className="scout-countries">
        <h4>מדינות מועדפות:</h4>
        <div className="country-tags">
          {scout.preferredCountries.map(countryId => (
            <span key={countryId} className="country-tag">
              {countries.find(c => c.id === countryId)?.name}
            </span>
          ))}
        </div>
      </div>

      {isActive ? (
        <div className="scout-status">
          <span className="status-badge active">
            פעיל ב{countries.find(c => c.id === activeScouts[scout.id])?.name}
          </span>
          <button 
            className="cancel-mission-btn"
            onClick={onSelect}
          >
            בטל משימה
          </button>
        </div>
      ) : (
        <button 
          className={`assign-scout-btn ${isSelected ? 'selected' : ''}`}
          onClick={onSelect}
        >
          {isSelected ? 'בטל בחירה' : 'שלח למשימה'}
        </button>
      )}
    </div>
  );
};

export default ScoutCard; 