export type ReputationSource = 
  | 'TRANSFER_DEAL'
  | 'EQUIPMENT_PURCHASE'
  | 'OFFICE_UPGRADE'
  | 'STAFF_HIRE'
  | 'MEDIA_COVERAGE'
  | 'PLAYER_DEVELOPMENT'
  | 'SUCCESSFUL_NEGOTIATION'
  | 'COMMUNITY_EVENT'
  | 'CHARITY_DONATION';

export interface ReputationEvent {
  id: string;
  source: ReputationSource;
  amount: number;
  date: string;
  description: string;
  isPositive: boolean;
}

export interface EquipmentBenefits {
  staffEfficiency?: number;
  playerDevelopment?: number;
  scoutingAccuracy?: number;
  negotiationPower?: number;
  reputationBonus?: number;
  comfort?: number;
  productivity?: number;
  dataAnalysis?: number;
  injuryPrevention?: number;
  recoverySpeed?: number;
  negotiationSuccess?: number;
  clientSatisfaction?: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: 'OFFICE' | 'TECH' | 'TRAINING' | 'MEDICAL';
  cost: number;
  monthlyMaintenance: number;
  reputationBonus: number;
  minOfficeLevel: number;
  benefits: EquipmentBenefits;
  condition?: number;
  description: string;
  durability?: number;
}

export interface CommunityEvent {
  id: string;
  name: string;
  type: 'CHARITY' | 'YOUTH_DEVELOPMENT' | 'LOCAL_SPONSORSHIP' | 'MEDIA_EVENT';
  cost: number;
  reputationGain: number;
  duration: number; // ימים
  requirements: {
    minReputation?: number;
    minBudget?: number;
    minStaffSize?: number;
  };
  benefits: {
    localInfluence: number;
    mediaExposure: number;
    communitySupport: number;
  };
}

export interface ReputationLevel {
  level: number;
  name: string;
  minPoints: number;
  benefits: {
    negotiationBonus: number;
    transferFeeBonus: number;
    playerInterestBonus: number;
    sponsorshipBonus: number;
  };
  unlocks: string[];
} 
