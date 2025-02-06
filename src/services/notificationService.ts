import { store } from '../store';
import { TransferOffer, NegotiationMessage } from '../types/transfers';
import { showToast } from '../components/common/Toast';

export class NotificationService {
  static handleTransferNotification(offer: TransferOffer) {
    const { status, negotiationStage, currentOffer, playerId } = offer;
    
    switch (status) {
      case 'PENDING':
        showToast.info(`הצעה חדשה התקבלה עבור שחקן ${playerId}`);
        break;
      case 'NEGOTIATING':
        if (negotiationStage === 'COUNTER_OFFER') {
          showToast.info(`הצעה נגדית התקבלה: ${currentOffer.toLocaleString()} €`);
        }
        break;
      case 'ACCEPTED':
        showToast.success(`העברה הושלמה בהצלחה! סכום: ${currentOffer.toLocaleString()} €`);
        break;
      case 'REJECTED':
        showToast.error('ההצעה נדחתה');
        break;
    }
  }

  static handleNegotiationMessage(message: NegotiationMessage) {
    if (message.senderId !== 'agent') { // רק הודעות שלא מהסוכן
      switch (message.type) {
        case 'OFFER':
        case 'COUNTER_OFFER':
          showToast.info(`הצעה חדשה: ${message.content}`);
          break;
        case 'MESSAGE':
          showToast.info(`הודעה חדשה: ${message.content}`);
          break;
        case 'ACCEPT':
          showToast.success('ההצעה התקבלה!');
          break;
        case 'REJECT':
          showToast.error('ההצעה נדחתה');
          break;
      }
    }
  }

  static handleExpiringOffers() {
    const { activeOffers } = store.getState().transfers.market;
    const today = new Date();
    
    activeOffers.forEach(offer => {
      const expiryDate = new Date(offer.expiresAt);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry === 1) {
        showToast.warning(`הצעה עבור שחקן ${offer.playerId} תפוג מחר!`);
      } else if (daysUntilExpiry === 3) {
        showToast.info(`הצעה עבור שחקן ${offer.playerId} תפוג בעוד 3 ימים`);
      }
    });
  }

  static handleMarketOpportunities() {
    const { marketTrends } = store.getState().transfers.market;
    
    marketTrends.forEach(trend => {
      if (trend.priceChange < -10) {
        showToast.info(`ירידת מחירים משמעותית בעמדת ${trend.position}! הזדמנות לרכישה`);
      }
    });
  }
}

// בדיקת הצעות שעומדות לפוג כל יום
setInterval(() => {
  NotificationService.handleExpiringOffers();
}, 24 * 60 * 60 * 1000);

// בדיקת הזדמנויות שוק כל 12 שעות
setInterval(() => {
  NotificationService.handleMarketOpportunities();
}, 12 * 60 * 60 * 1000); 