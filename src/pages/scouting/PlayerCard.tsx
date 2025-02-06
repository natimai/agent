import React from 'react';
import { Player } from '../../types/player';
import './PlayerCard.css';
import { scoutingService } from '../../services/scoutingService';

interface PlayerCardProps {
  player: Player;
  onScout: () => void;
  onCancelScout: () => void;
}

const PlayerCard = ({ player, onScout, onCancelScout }: PlayerCardProps) => {
  const getVisibleAttributes = () => {
    if (!player.scoutingProgress) return {};
    
    const progress = player.scoutingProgress / 100;
    const visibleCount = Math.floor(Object.keys(player.attributes).length * progress);
    
    return Object.fromEntries(
      Object.entries(player.attributes)
        .slice(0, visibleCount)
    );
  };

  const visibleAttributes = getVisibleAttributes();

  return (
    <div className="player-card">
      <div className="player-header">
        <h3>{player.name}</h3>
        <span className="player-age">גיל: {player.age}</span>
      </div>

      <div className="player-position">
        <span className="main-position">{player.position.main}</span>
        {player.position.secondary?.map(pos => (
          <span key={pos} className="secondary-position">{pos}</span>
        ))}
      </div>

      {player.scoutingProgress ? (
        <div className="scouting-controls">
          <div className="scouting-progress">
            <div 
              className="progress-bar"
              style={{ width: `${player.scoutingProgress}%` }}
            />
            <span>{Math.floor(player.scoutingProgress)}%</span>
          </div>
          <button 
            className="cancel-button"
            onClick={onCancelScout}
          >
            בטל סקאוטינג
          </button>
        </div>
      ) : (
        <button 
          className="scout-button"
          onClick={onScout}
        >
          התחל סקאוטינג (₪{scoutingService.getScoutingCost().toLocaleString()})
        </button>
      )}

      <div className="attributes-grid">
        {Object.entries(visibleAttributes).map(([key, value]) => (
          <div key={key} className="attribute">
            <span className="attribute-name">{key}</span>
            <span className="attribute-value">{value}</span>
          </div>
        ))}
        {Object.keys(visibleAttributes).length < 6 && (
          <div className="hidden-attributes">
            {Array(6 - Object.keys(visibleAttributes).length).fill('?').map((_, i) => (
              <div key={i} className="attribute hidden">???</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard; 