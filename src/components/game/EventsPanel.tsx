import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { handleEvent } from '../../store/slices/gameSlice';
import { GameEvent } from '../../types/game';

const EventsPanel = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => 
    state.game.events.filter(e => !e.isHandled)
  );

  const handleEventClick = (event: GameEvent) => {
    dispatch(handleEvent(event.id));
  };

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-68 z-20">
      <div className="bg-white rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">אירועים ({events.length})</h3>
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onClick={handleEventClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event: GameEvent;
  onClick: (event: GameEvent) => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'TRANSFER_OFFER': return '💰';
      case 'CONTRACT_EXPIRY': return '📄';
      case 'INJURY': return '🏥';
      case 'MATCH_RESULT': return '⚽';
      default: return '📌';
    }
  };

  const getEventColor = (type: GameEvent['type']) => {
    switch (type) {
      case 'TRANSFER_OFFER': return 'bg-green-100 border-green-500';
      case 'CONTRACT_EXPIRY': return 'bg-yellow-100 border-yellow-500';
      case 'INJURY': return 'bg-red-100 border-red-500';
      case 'MATCH_RESULT': return 'bg-blue-100 border-blue-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div 
      className={`p-3 rounded-lg border-r-4 cursor-pointer hover:opacity-90 ${getEventColor(event.type)}`}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start">
        <span className="text-2xl ml-3">{getEventIcon(event.type)}</span>
        <div className="flex-1">
          <p className="font-medium">{event.description}</p>
          <p className="text-sm text-gray-600">
            {new Date(event.date).toLocaleDateString('he-IL')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventsPanel; 