import { PlayerPosition } from './player';

export type TransferStatus = 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
export type NegotiationStage = 'INITIAL' | 'COUNTER_OFFER' | 'FINAL_OFFER' | 'CONCLUDED';

export interface TransferOffer {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  initialOffer: number;
  currentOffer: number;
  status: TransferStatus;
  createdAt: string;
  expiresAt: string;
  negotiationStage: NegotiationStage;
  counterOffers: CounterOffer[];
  conditions: TransferCondition[];
  agentFeePercentage: number;
  reputationImpact: number;
  messages: NegotiationMessage[];
}

export interface CounterOffer {
  id: string;
  amount: number;
  fromTeam: string;
  timestamp: string;
  message?: string;
  reputationRequirement?: number;
}

export interface TransferCondition {
  type: 'BONUS' | 'SELL_ON_PERCENTAGE' | 'MINIMUM_GAMES' | 'GOALS_BONUS';
  value: number;
  description: string;
  threshold: number;
  bonus: number;
}

export interface TransferMarket {
  activeOffers: TransferOffer[];
  completedTransfers: CompletedTransfer[];
  marketTrends: MarketTrend[];
  negotiations: NegotiationSession[];
}

export interface CompletedTransfer {
  id: string;
  playerId: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  amount: number;
  agentFeePercentage: number;
  reputationImpact: number;
  conditions: TransferCondition[];
  completedAt: string;
}

export interface MarketTrend {
  position: PlayerPosition;
  averagePrice: number;
  numberOfTransfers: number;
  priceChange: number;
  timestamp: string;
}

export interface NegotiationSession {
  id: string;
  transferOfferId: string;
  startDate: string;
  lastActivity: string;
  participants: string[];
  messages: NegotiationMessage[];
  status: 'ACTIVE' | 'CONCLUDED' | 'FAILED';
}

export interface NegotiationMessage {
  id: string;
  content: string;
  sender: 'AGENT' | 'TEAM';
  timestamp: string;
} 