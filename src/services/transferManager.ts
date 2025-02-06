import { v4 as uuidv4 } from 'uuid';
import { store } from '../store';
import { Player } from '../types/player';
import { Scout } from '../types/scout';
import { TransferOffer, TransferCondition } from '../types/transfers';
import { OFFICE_LEVELS } from '../types/office';
import { updateTreasury, selectTreasury } from '../store/slices/treasurySlice';
import { addTransferOffer, updateTransferOffer, addCompletedTransfer, selectActiveOffers } from '../store/slices/transfersSlice';
import { updatePlayer, selectPlayerById } from '../store/slices/playersSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { toast } from '../utils/toast';
import { selectTeam } from '../store/slices/teamSlice';
import { selectOffice } from '../store/slices/officeSlice';
import { RootState } from '../types/types';

class TransferManager {
  private calculateContractMultiplier(monthsRemaining: number): number {
    if (monthsRemaining <= 6) return 0.5;
    if (monthsRemaining <= 12) return 0.75;
    if (monthsRemaining <= 24) return 1;
    return 1.25;
  }

  private calculatePlayerValue(player: Player): number {
    const baseValue = player.value;
    const contractMultiplier = this.calculateContractMultiplier(player.contract.monthsRemaining);
    const potentialMultiplier = 1 + (player.potential / 100);
    
    return Math.round(baseValue * contractMultiplier * potentialMultiplier);
  }

  public createOffer(player: Player, amount: number): void {
    const state = store.getState() as unknown as RootState;
    const myTeam = selectTeam(state);
    const treasury = selectTreasury(state);
    const office = selectOffice(state);

    if (amount > treasury.balance) {
      toast.error('אין מספיק כסף בקופה');
      return;
    }

    const playerValue = this.calculatePlayerValue(player);
    const minAcceptableOffer = playerValue * 0.8;

    if (amount < minAcceptableOffer) {
      toast.error('ההצעה נמוכה מדי');
      return;
    }

    const agentFeePercentage = office.level.commissionRate;
    const agentFee = Math.round(amount * (agentFeePercentage / 100));

    if (amount + agentFee > treasury.balance) {
      toast.error('אין מספיק כסף לתשלום עמלת הסוכן');
      return;
    }

    const existingOffer = selectActiveOffers(state).find(
      (offer: TransferOffer) => offer.playerId === player.id && offer.toTeamId === myTeam.id
    );

    if (existingOffer) {
      toast.error('כבר קיימת הצעה פעילה לשחקן זה');
      return;
    }

    const offer: TransferOffer = {
      id: uuidv4(),
      playerId: player.id,
      fromTeamId: player.teamId,
      toTeamId: myTeam.id,
      initialOffer: amount,
      currentOffer: amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      negotiationStage: 'INITIAL',
      counterOffers: [],
      conditions: [],
      agentFeePercentage,
      reputationImpact: 0,
      messages: []
    };

    store.dispatch(addTransferOffer(offer));
    store.dispatch(updateTreasury({ balance: treasury.balance - amount }));

    store.dispatch(addNotification({
      type: 'SUCCESS',
      title: 'הצעת העברה נשלחה',
      message: `נשלחה הצעה בסך ${amount.toLocaleString()} ₪ עבור ${player.name}`
    }));

    toast.success('ההצעה נשלחה בהצלחה');
  }

  public acceptOffer(offer: TransferOffer): void {
    const state = store.getState() as unknown as RootState;
    const player = selectPlayerById(state, offer.playerId);
    
    if (!player) {
      toast.error('השחקן לא נמצא');
      return;
    }

    const completedTransfer = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      fromTeam: offer.fromTeamId,
      toTeam: offer.toTeamId,
      amount: offer.currentOffer,
      agentFeePercentage: offer.agentFeePercentage,
      reputationImpact: offer.reputationImpact,
      conditions: offer.conditions,
      completedAt: new Date().toISOString()
    };

    store.dispatch(addCompletedTransfer(completedTransfer));
    store.dispatch(updatePlayer({ 
      id: player.id,
      changes: { teamId: offer.toTeamId }
    }));

    store.dispatch(addNotification({
      type: 'SUCCESS',
      title: 'העברה הושלמה',
      message: `${player.name} הועבר לקבוצתך תמורת ${offer.currentOffer.toLocaleString()} ₪`
    }));

    toast.success('ההעברה הושלמה בהצלחה');
  }

  public updateOfferStatus(offerId: string, status: 'ACCEPTED' | 'REJECTED'): void {
    store.dispatch(updateTransferOffer({ 
      id: offerId,
      changes: { status }
    }));
  }

  public addTransferCondition(offerId: string, condition: TransferCondition): void {
    const state = store.getState() as unknown as RootState;
    const offer = selectActiveOffers(state).find((o: TransferOffer) => o.id === offerId);
    
    if (!offer) {
      toast.error('ההצעה לא נמצאה');
      return;
    }

    store.dispatch(updateTransferOffer({
      id: offerId,
      changes: {
        conditions: [...offer.conditions, condition]
      }
    }));
  }
}

export const transferManager = new TransferManager(); 