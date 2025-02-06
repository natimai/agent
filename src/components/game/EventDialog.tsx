import React from 'react';
import { useDispatch } from 'react-redux';
import { GameEvent } from '../../types/game';
import { updateTreasury, updateReputation } from '../../store/slices/gameSlice';

interface EventDialogProps {
  event: GameEvent;
  onClose: () => void;
}

const EventDialog = ({ event, onClose }: EventDialogProps) => {
  const dispatch = useDispatch();

  const handleAction = (action: string) => {
    switch (event.type) {
      case 'TRANSFER_OFFER':
        if (action === 'accept') {
          dispatch(updateTreasury(event.data.offerAmount));
          dispatch(updateReputation(5));
        } else {
          dispatch(updateReputation(-2));
        }
        break;
      // נוסיף טיפול באירועים נוספים בהמשך
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{event.description}</h2>
        
        {event.type === 'TRANSFER_OFFER' && (
          <div className="space-y-4">
            <p>סכום ההצעה: ₪{event.data.offerAmount.toLocaleString()}</p>
            <p>שכר שבועי: ₪{event.data.weeklyWage.toLocaleString()}</p>
            <p>עמלת סוכן: ₪{event.data.agentFee.toLocaleString()}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleAction('reject')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                דחה
              </button>
              <button
                onClick={() => handleAction('accept')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                אשר
              </button>
            </div>
          </div>
        )}
        
        {/* נוסיף טיפול בסוגי אירועים נוספים בהמשך */}
      </div>
    </div>
  );
};

export default EventDialog; 