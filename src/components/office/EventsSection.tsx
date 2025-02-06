import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { handleEvent } from '../../store/slices/officeSlice';
import { OfficeEvent } from '../../types/officeEvents';
import { formatDate } from '../../utils/format';

const EventsSection: React.FC = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => 
    state.office.events.filter(event => !event.isHandled)
  );

  const handleEventOption = (eventId: string, optionId: string) => {
    dispatch(handleEvent({ eventId, optionId }));
  };

  return (
    <div className="office-section events-section">
      <h2>אירועים פעילים</h2>
      <AnimatePresence>
        <div className="events-grid">
          {events.map((event: OfficeEvent) => (
            <motion.div
              key={event.id}
              className="event-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="event-date">{formatDate(event.date)}</span>
              </div>
              <p className="event-description">{event.description}</p>
              {event.expiresAt && (
                <div className="event-expiry">
                  פג תוקף: {formatDate(event.expiresAt)}
                </div>
              )}
              <div className="event-options">
                {event.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleEventOption(event.id, option.id)}
                    className="event-option-btn"
                  >
                    {option.text}
                    {option.effects && (
                      <div className="option-effects">
                        {option.effects.treasury && (
                          <span className={option.effects.treasury > 0 ? 'positive' : 'negative'}>
                            {option.effects.treasury > 0 ? '+' : ''}{option.effects.treasury}₪
                          </span>
                        )}
                        {option.effects.reputation && (
                          <span className={option.effects.reputation > 0 ? 'positive' : 'negative'}>
                            {option.effects.reputation > 0 ? '+' : ''}{option.effects.reputation} מוניטין
                          </span>
                        )}
                        {option.effects.experience && (
                          <span className="experience">
                            {option.effects.experience > 0 ? '+' : ''}{option.effects.experience} XP
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default EventsSection; 