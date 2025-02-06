import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { scoutingService } from '../../services/scoutingService';
import PlayerCard from './PlayerCard';
import './ScoutingPage.css';
import PageWrapper from '../../components/common/PageWrapper';

const ScoutingPage = () => {
  const dispatch = useDispatch();
  const { players } = useSelector((state: RootState) => state.players);
  const { treasury } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    // מגלה שחקנים חדשים בטעינת הדף
    if (players.length === 0) {
      scoutingService.discoverNewPlayers(5);
    }
  }, []);

  const undiscoveredPlayers = players.filter(player => !player.isDiscovered);

  return (
    <PageWrapper>
      <div className="scouting-page">
        <div className="scouting-header">
          <h1>סקאוטינג</h1>
          <div className="scouting-stats">
            <div className="stat">
              <span>תקציב זמין:</span>
              <span>₪{treasury.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span>שחקנים לגילוי:</span>
              <span>{undiscoveredPlayers.length}</span>
            </div>
          </div>
        </div>

        <div className="players-grid">
          {undiscoveredPlayers.map(player => (
            <PlayerCard 
              key={player.id} 
              player={player}
              onScout={() => scoutingService.startScouting(player.id)}
              onCancelScout={() => {}}
            />
          ))}
          {undiscoveredPlayers.length === 0 && (
            <div className="empty-state">
              <p>אין שחקנים חדשים לגילוי</p>
              <button onClick={() => scoutingService.discoverNewPlayers(5)}>
                חפש שחקנים חדשים
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ScoutingPage; 