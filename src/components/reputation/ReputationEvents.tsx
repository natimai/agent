import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/format';
import { ReputationEvent, ReputationSource } from '../../types/reputation';

const ReputationEvents: React.FC = () => {
  const { events, currentPoints } = useSelector((state: RootState) => state.reputation);

  const getSourceIcon = (source: ReputationSource): string => {
    switch (source) {
      case 'TRANSFER_DEAL':
        return '🤝';
      case 'EQUIPMENT_PURCHASE':
        return '🛠️';
      case 'OFFICE_UPGRADE':
        return '🏢';
      case 'STAFF_HIRE':
        return '👥';
      case 'MEDIA_COVERAGE':
        return '📰';
      case 'PLAYER_DEVELOPMENT':
        return '⚽';
      case 'SUCCESSFUL_NEGOTIATION':
        return '📈';
      case 'COMMUNITY_EVENT':
        return '🎉';
      case 'CHARITY_DONATION':
        return '❤️';
      default:
        return '📋';
    }
  };

  const getSourceLabel = (source: ReputationSource): string => {
    switch (source) {
      case 'TRANSFER_DEAL':
        return 'עסקת העברה';
      case 'EQUIPMENT_PURCHASE':
        return 'רכישת ציוד';
      case 'OFFICE_UPGRADE':
        return 'שדרוג משרד';
      case 'STAFF_HIRE':
        return 'גיוס צוות';
      case 'MEDIA_COVERAGE':
        return 'סיקור תקשורתי';
      case 'PLAYER_DEVELOPMENT':
        return 'התפתחות שחקן';
      case 'SUCCESSFUL_NEGOTIATION':
        return 'משא ומתן מוצלח';
      case 'COMMUNITY_EVENT':
        return 'אירוע קהילתי';
      case 'CHARITY_DONATION':
        return 'תרומה לצדקה';
      default:
        return 'אחר';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">מוניטין</h2>
        <div className="text-2xl font-bold">
          {currentPoints} נקודות
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              event.isPositive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSourceIcon(event.source)}</span>
                <div>
                  <div className="font-semibold">{event.description}</div>
                  <div className="text-sm text-gray-600">
                    {getSourceLabel(event.source)} • {formatDate(event.date)}
                  </div>
                </div>
              </div>
              <div className={`font-bold ${
                event.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {event.isPositive ? '+' : '-'}{event.amount}
              </div>
            </div>
          </motion.div>
        ))}

        {events.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            אין אירועי מוניטין להצגה
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationEvents; 