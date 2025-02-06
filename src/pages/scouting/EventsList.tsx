import React from 'react';
import { ScoutingEvent, ScoutingEventType } from '../../types/scoutingEvent';
import { countries } from '../../data/countries';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './EventsList.css';

interface EventsListProps {
  events: ScoutingEvent[];
}

const EventsList = ({ events }: EventsListProps) => {
  const { treasury } = useSelector((state: RootState) => state.game);

  if (events.length === 0) {
    return (
      <div className="no-events">
        <p>אין אירועים פעילים כרגע</p>
      </div>
    );
  }

  return (
    <div className="events-list">
      {events.map(event => (
        <div key={`${event.type}-${event.countryId}`} className="event-card">
          <div className="event-header">
            <span className={`event-type ${event.type.toLowerCase()}`}>
              {getEventTypeText(event.type)}
            </span>
            <span className="event-country">
              {countries.find(c => c.id === event.countryId)?.name}
            </span>
          </div>

          <p className="event-description">{event.description}</p>

          <div className="event-options">
            {event.options.map((option, index) => (
              <button
                key={index}
                className="event-option-btn"
                onClick={() => option.action()}
                disabled={Boolean(option.cost && option.cost > treasury)}
              >
                {option.text}
                {option.cost && <span className="option-cost">₪{option.cost.toLocaleString()}</span>}
                {option.successChance && 
                  <span className="option-chance">
                    {Math.floor(option.successChance * 100)}% סיכוי להצלחה
                  </span>
                }
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const getEventTypeText = (type: ScoutingEventType): string => {
  switch (type) {
    case 'WONDERKID_FOUND':
      return 'כישרון צעיר';
    case 'HIDDEN_GEM':
      return 'שחקן נסתר';
    case 'BIDDING_WAR':
      return 'תחרות רכש';
    case 'LOCAL_CONNECTION':
      return 'קשר מקומי';
    case 'TOURNAMENT_ACCESS':
      return 'טורניר נוער';
    default:
      return 'אירוע לא ידוע';
  }
};

export default EventsList; 