import store from '../store';
import { addOffer, updateOffer, completeTransfer } from '../store/slices/transfersSlice';
import { updateTreasury } from '../store/slices/gameSlice';
import { addCommission } from '../store/slices/officeSlice';
import { TransferOffer, TransferStatus, NegotiationStage, TransferCondition } from '../types/transfers';
import { Player } from '../types/player';
import { OFFICE_LEVELS } from '../types/office';

export class TransferManager {
  calculatePlayerValue(player: Player): number {
    const baseValue = this.calculateBaseValue(player);
    const potentialMultiplier = this.calculatePotentialMultiplier(player);
    const ageMultiplier = this.calculateAgeMultiplier(player);
    const formMultiplier = this.calculateFormMultiplier(player);
    
    return Math.round(baseValue * potentialMultiplier * ageMultiplier * formMultiplier);
  }

  private calculateBaseValue(player: Player): number {
    const skillsAverage = Object.values(player.skills).reduce((a, b) => a + b, 0) 
      / Object.values(player.skills).length;
    return skillsAverage * 100000;
  }

  private calculatePotentialMultiplier(player: Player): number {
    return 1 + (player.potential / 100);
  }

  private calculateAgeMultiplier(player: Player): number {
    if (player.age < 23) return 1.5;
    if (player.age < 28) return 1.2;
    if (player.age < 32) return 1;
    return 0.7;
  }

  private calculateFormMultiplier(player: Player): number {
    return 1 + ((player.form - 50) / 100);
  }

  createTransferOffer(
    playerId: string, 
    fromTeamId: string, 
    toTeamId: string, 
    amount: number
  ): TransferOffer {
    const offer: TransferOffer = {
      id: Date.now().toString(),
      playerId,
      fromTeamId,
      toTeamId,
      initialOffer: amount,
      currentOffer: amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: this.calculateExpiryDate(),
      negotiationStage: 'INITIAL',
      counterOffers: [],
      conditions: this.generateRandomConditions(),
      agentFeePercentage: 5
    };

    store.dispatch(addOffer(offer));
    return offer;
  }

  handleCounterOffer(offerId: string, newAmount: number, message?: string) {
    const offer = this.getOffer(offerId);
    if (!offer) return;

    const counterOffer = {
      id: Date.now().toString(),
      amount: newAmount,
      fromTeam: offer.toTeamId,
      timestamp: new Date().toISOString(),
      message
    };

    store.dispatch(updateOffer({
      id: offerId,
      currentOffer: newAmount,
      negotiationStage: 'COUNTER_OFFER',
      counterOffers: [...offer.counterOffers, counterOffer]
    }));
  }

  private handleTransferCompletion(transferAmount: number) {
    const state = store.getState();
    const officeLevel = state.office.level;
    const commissionRate = OFFICE_LEVELS[officeLevel].commissionRate;
    
    // חישוב העמלה
    const commission = Math.floor(transferAmount * commissionRate);
    
    // עדכון התקציב והעמלות
    store.dispatch(updateTreasury(commission));
    store.dispatch(addCommission(commission));

    return commission;
  }

  async completeTransfer(transferId: string) {
    const transfer = this.getOffer(transferId);
    if (!transfer) return;

    try {
      const commission = this.handleTransferCompletion(transfer.currentOffer);
      
      // הוספת הודעה על העמלה
      this.notificationService.show({
        type: 'success',
        message: `העברה הושלמה! קיבלת עמלה בסך ₪${commission.toLocaleString()}`
      });

      store.dispatch(completeTransfer({
        id: Date.now().toString(),
        playerId: transfer.playerId,
        fromTeam: transfer.fromTeamId,
        toTeam: transfer.toTeamId,
        amount: transfer.currentOffer,
        date: new Date().toISOString(),
        conditions: transfer.conditions,
        agentFee: commission
      }));

    } catch (error) {
      // ... טיפול בשגיאות ...
    }
  }

  private calculateExpiryDate(): string {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 3);
    return expiry.toISOString();
  }

  private generateRandomConditions(): TransferCondition[] {
    if (Math.random() > 0.3) return []; // 70% סיכוי שלא יהיו תנאים נוספים

    const conditions: TransferCondition[] = [];
    const types = ['APPEARANCES', 'GOALS', 'ASSISTS', 'TROPHIES', 'RESALE_PERCENTAGE'] as const;
    
    const numConditions = Math.floor(Math.random() * 2) + 1; // 1-2 תנאים
    
    for (let i = 0; i < numConditions; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      conditions.push({
        type,
        threshold: this.getRandomThreshold(type),
        bonus: this.getRandomBonus()
      });
    }

    return conditions;
  }

  private getRandomThreshold(type: TransferCondition['type']): number {
    switch (type) {
      case 'APPEARANCES': return Math.floor(Math.random() * 20) + 10;
      case 'GOALS': return Math.floor(Math.random() * 10) + 5;
      case 'ASSISTS': return Math.floor(Math.random() * 10) + 5;
      case 'TROPHIES': return Math.floor(Math.random() * 2) + 1;
      case 'RESALE_PERCENTAGE': return Math.floor(Math.random() * 15) + 5;
      default: return 0;
    }
  }

  private getRandomBonus(): number {
    return Math.floor(Math.random() * 500000) + 100000;
  }

  private getOffer(offerId: string): TransferOffer | undefined {
    return store.getState().transfers.market.activeOffers.find(o => o.id === offerId);
  }

  static generateAutomaticOffers(player: Player): TransferOffer[] {
    const offers: TransferOffer[] = [];
    const baseValue = player.value;
    const numOffers = Math.floor(Math.random() * 3) + 1; // 1-3 הצעות

    for (let i = 0; i < numOffers; i++) {
      const variationPercentage = (Math.random() * 40) - 20; // -20% עד +20%
      const offerAmount = baseValue * (1 + variationPercentage / 100);
      
      const conditions = this.generateRandomConditions(offerAmount);
      const agentFee = this.calculateAgentFee(offerAmount);
      
      const offer: TransferOffer = {
        id: Date.now().toString() + i,
        playerId: player.id,
        fromTeamId: player.currentTeam,
        toTeamId: this.getRandomTeamId(), // פונקציה שצריך ליצור
        initialOffer: offerAmount,
        currentOffer: offerAmount,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        expiresAt: this.calculateExpiryDate(),
        negotiationStage: 'INITIAL',
        counterOffers: [],
        conditions,
        agentFeePercentage: agentFee,
        reputationImpact: this.calculateReputationImpact(offerAmount, player.value),
        messages: []
      };

      offers.push(offer);
    }

    return offers;
  }

  private static generateRandomConditions(baseAmount: number): TransferCondition[] {
    const conditions: TransferCondition[] = [];
    const conditionTypes: Array<'APPEARANCES' | 'GOALS' | 'ASSISTS' | 'TROPHIES' | 'RESALE_PERCENTAGE'> = 
      ['APPEARANCES', 'GOALS', 'ASSISTS', 'TROPHIES', 'RESALE_PERCENTAGE'];
    
    const numConditions = Math.floor(Math.random() * 3); // 0-2 תנאים
    
    for (let i = 0; i < numConditions; i++) {
      const type = conditionTypes[Math.floor(Math.random() * conditionTypes.length)];
      let threshold: number;
      let bonus: number;
      
      switch (type) {
        case 'APPEARANCES':
          threshold = Math.floor(Math.random() * 30) + 20; // 20-50 הופעות
          bonus = baseAmount * 0.1; // 10% מסכום ההעברה
          break;
        case 'GOALS':
          threshold = Math.floor(Math.random() * 15) + 5; // 5-20 שערים
          bonus = baseAmount * 0.15; // 15% מסכום ההעברה
          break;
        case 'ASSISTS':
          threshold = Math.floor(Math.random() * 15) + 5; // 5-20 בישולים
          bonus = baseAmount * 0.12; // 12% מסכום ההעברה
          break;
        case 'TROPHIES':
          threshold = Math.floor(Math.random() * 2) + 1; // 1-3 גביעים
          bonus = baseAmount * 0.2; // 20% מסכום ההעברה
          break;
        case 'RESALE_PERCENTAGE':
          threshold = Math.floor(Math.random() * 15) + 10; // 10-25 אחוז ממכירה עתידית
          bonus = 0; // הבונוס הוא האחוז עצמו
          break;
      }
      
      conditions.push({ type, threshold, bonus });
    }
    
    return conditions;
  }

  private static calculateAgentFee(amount: number): number {
    // חישוב עמלת סוכן בהתאם לסכום ההעברה
    if (amount < 1000000) return 5; // 5% עד מיליון יורו
    if (amount < 5000000) return 7; // 7% עד 5 מיליון יורו
    if (amount < 10000000) return 8; // 8% עד 10 מיליון יורו
    return 10; // 10% מעל 10 מיליון יורו
  }

  private static calculateReputationImpact(offerAmount: number, playerValue: number): number {
    // חישוב השפעת המוניטין בהתאם להפרש בין ההצעה לשווי השחקן
    const difference = offerAmount - playerValue;
    const percentageDifference = (difference / playerValue) * 100;
    
    if (percentageDifference > 20) return 15; // עסקה מצוינת
    if (percentageDifference > 10) return 10; // עסקה טובה
    if (percentageDifference > 0) return 5; // עסקה חיובית
    if (percentageDifference > -10) return 0; // עסקה סבירה
    return -5; // עסקה גרועה
  }

  private static calculateExpiryDate(): string {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 4) + 4); // 4-7 ימים
    return expiryDate.toISOString();
  }

  private static getRandomTeamId(): string {
    // כאן צריך להוסיף לוגיקה לבחירת קבוצה רנדומלית מתאימה
    return 'team_' + Math.floor(Math.random() * 20 + 1);
  }

  static processAutomaticOffers() {
    const state = store.getState();
    const { activeOffers } = state.transfers.market;
    
    activeOffers.forEach(offer => {
      if (offer.status === 'PENDING' && new Date(offer.expiresAt) < new Date()) {
        // הצעה פגה תוקף
        store.dispatch(updateOffer({
          id: offer.id,
          status: 'REJECTED',
          negotiationStage: 'CONCLUDED'
        }));
      } else if (offer.status === 'NEGOTIATING' && Math.random() > 0.7) {
        // 30% סיכוי להצעה נגדית
        const counterOffer = offer.currentOffer * (1 + (Math.random() * 0.2));
        store.dispatch(updateOffer({
          id: offer.id,
          currentOffer: counterOffer,
          negotiationStage: 'COUNTER_OFFER',
          messages: [
            ...offer.messages,
            {
              id: Date.now().toString(),
              senderId: offer.fromTeamId,
              content: `הצעה נגדית: ${counterOffer.toLocaleString()} €`,
              timestamp: new Date().toISOString(),
              type: 'COUNTER_OFFER',
              offer: counterOffer
            }
          ]
        }));
      }
    });
  }
}

// הפעלת מערכת ההצעות האוטומטית כל 5 דקות
setInterval(() => {
  TransferManager.processAutomaticOffers();
}, 5 * 60 * 1000); 