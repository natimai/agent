import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { handleEvent } from '../../store/slices/gameSlice';

const EventNotifications = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => 
    state.game.events.filter(e => !e.isHandled)
  );

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm">
      {events.map(event => (
        <div
          key={event.id}
          className="bg-white shadow-lg rounded-lg p-4 mb-2 border-r-4 border-blue-500"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString('he-IL')}
              </p>
            </div>
            <button
              onClick={() => dispatch(handleEvent(event.id))}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventNotifications; 