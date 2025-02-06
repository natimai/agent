import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TransferOffer, TransferCondition, TransferStatus } from '../../types/transfers';
import { transferManager } from '../../services/transferManager';

interface TransferOfferCardProps {
  offer: TransferOffer;
}

const TransferOfferCard = ({ offer }: TransferOfferCardProps) => {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [counterOffer, setCounterOffer] = useState(offer.currentOffer);

  const handleCounterOffer = () => {
    transferManager.handleCounterOffer(offer.id, counterOffer);
    setIsNegotiating(false);
  };

  const handleAccept = () => {
    transferManager.completeTransfer(offer.id);
  };

  const getStatusText = (status: TransferStatus): string => {
    const statusMap = {
      PENDING: 'ממתין',
      NEGOTIATING: 'במשא ומתן',
      ACCEPTED: 'התקבל',
      REJECTED: 'נדחה',
      COMPLETED: 'הושלם'
    };
    return statusMap[status];
  };

  const getConditionText = (condition: TransferCondition): string => {
    const typeMap = {
      APPEARANCES: 'הופעות',
      GOALS: 'שערים',
      ASSISTS: 'בישולים',
      TROPHIES: 'תארים',
      RESALE_PERCENTAGE: 'אחוז ממכירה עתידית'
    };
    
    return `${typeMap[condition.type]}: ${condition.threshold} - בונוס: ₪${condition.bonus.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">הצעת העברה</h3>
          <p className="text-sm text-gray-600">
            תאריך: {new Date(offer.createdAt).toLocaleDateString('he-IL')}
          </p>
        </div>
        <div className="text-lg font-bold">
          ₪{offer.currentOffer.toLocaleString()}
        </div>
      </div>

      <div className="space-y-2">
        <p>מצב: {getStatusText(offer.status)}</p>
        <p>עמלת סוכן: {offer.agentFeePercentage}%</p>
        
        {offer.conditions.length > 0 && (
          <div>
            <p className="font-semibold">תנאים נוספים:</p>
            <ul className="list-disc list-inside">
              {offer.conditions.map(condition => (
                <li key={condition.type}>
                  {getConditionText(condition)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {offer.status === 'NEGOTIATING' && (
        <div className="mt-4">
          {isNegotiating ? (
            <div className="space-y-2">
              <input
                type="number"
                value={counterOffer}
                onChange={(e) => setCounterOffer(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCounterOffer}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  שלח הצעה נגדית
                </button>
                <button
                  onClick={() => setIsNegotiating(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsNegotiating(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                הצעה נגדית
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                קבל הצעה
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransferOfferCard; 