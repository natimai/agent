import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addScout, assignScout, unassignScout } from '../../store/slices/scoutingSlice';
import { updateTreasury } from '../../store/slices/gameSlice';
import ScoutCard from '../../components/scouting/ScoutCard';
import EventsList from './EventsList';
import CountryScoutingCard from './CountryScoutingCard';
import { scoutManager } from '../../services/scoutManager';
import { countries } from '../../data/countries';
import HireScoutForm from '../../components/scouting/HireScoutForm';
import { OFFICE_LEVELS } from '../../types/office';
import './ScoutingDashboard.css';
import { Scout } from '../../types/scout';
import PageWrapper from '../../components/common/PageWrapper';

const ScoutingDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { scouts, events, activeScouts } = useSelector((state: RootState) => state.scouting);
  const { treasury } = useSelector((state: RootState) => state.game);
  const { currentLevel } = useSelector((state: RootState) => state.office);
  const maxScouts = scoutManager.getMaxScouts(currentLevel);
  const canHireNewScout = scoutManager.canHireScout();
  const [selectedScout, setSelectedScout] = useState<string | null>(null);
  const [showHireForm, setShowHireForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // טעינת נתונים ראשונית
  useEffect(() => {
    try {
      // כאן נוכל להוסיף טעינת נתונים מהשרת אם יש צורך
    } catch (err) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בטעינת הנתונים');
    }
  }, []);

  const handleHireScout = () => {
    try {
      setShowHireForm(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בגיוס הסקאוט');
    }
  };

  const handleHireComplete = (scout: Scout) => {
    try {
      scoutManager.hireScout(scout);
      setShowHireForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בגיוס הסקאוט');
    }
  };

  const handleScoutSelection = (scoutId: string) => {
    setSelectedScout(scoutId === selectedScout ? null : scoutId);
  };

  const handleAssignScout = (countryId: string, duration: number) => {
    if (!selectedScout) return;

    const scout = scouts.find(s => s.id === selectedScout);
    if (!scout) return;

    try {
      scoutManager.startMission(scout, countryId, duration);
      setSelectedScout(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בהקצאת משימה');
    }
  };

  return (
    <PageWrapper>
      <div className="scouting-dashboard">
        <div className="dashboard-header">
          <h1>מערך סקאוטינג</h1>
          <div className="header-stats">
            <div className="stat">
              <span>תקציב זמין:</span>
              <span>₪{treasury.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span>סקאוטים פעילים:</span>
              <span>{Object.keys(activeScouts).length}/{maxScouts}</span>
            </div>
          </div>
          <div className="scouts-info">
            <span>סקאוטים: {scouts.length}/{maxScouts}</span>
            {error && <span className="error-message">{error}</span>}
          </div>
          <button 
            className="hire-scout-btn"
            onClick={handleHireScout}
            disabled={!canHireNewScout}
          >
            גייס סקאוט חדש
          </button>
        </div>

        {showHireForm && (
          <div className="modal-overlay" onClick={() => setShowHireForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <HireScoutForm
                onHire={handleHireComplete}
                onCancel={() => setShowHireForm(false)}
              />
            </div>
          </div>
        )}

        <div className="dashboard-content">
          <div className="scouts-section">
            <div className="section-header">
              <h2>הסקאוטים שלי</h2>
            </div>
            <div className="scouts-grid">
              {scouts.map(scout => (
                <ScoutCard
                  key={scout.id}
                  scout={scout}
                  isActive={Boolean(scout.currentMission)}
                  isSelected={scout.id === selectedScout}
                  onSelect={() => handleScoutSelection(scout.id)}
                />
              ))}
              {scouts.length === 0 && (
                <div className="empty-state">
                  <p>אין סקאוטים פעילים</p>
                  <button onClick={handleHireScout}>גייס סקאוט ראשון</button>
                </div>
              )}
            </div>
          </div>

          <div className="missions-section">
            {selectedScout ? (
              <>
                <h2>בחר מדינת יעד</h2>
                <div className="countries-grid">
                  {countries.map(country => (
                    <CountryScoutingCard
                      key={country.id}
                      country={country}
                      scout={scouts.find(s => s.id === selectedScout)!}
                      onStartMission={handleAssignScout}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="events-section">
                <h2>אירועים פעילים</h2>
                <EventsList events={events} />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ScoutingDashboard; 