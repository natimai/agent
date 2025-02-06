export type OfficeEventType = 
  | 'SPONSOR_OFFER'
  | 'STAFF_ISSUE'
  | 'MEDIA_COVERAGE'
  | 'RIVAL_CONFLICT'
  | 'SPECIAL_OPPORTUNITY'
  | 'LEGAL_ISSUE'
  | 'REPUTATION_EVENT';

export interface OfficeEventOption {
  id: string;
  text: string;
  effects: {
    reputation?: number;
    treasury?: number;
    experience?: number;
    relationships?: Array<{
      entityId: string;
      change: number;
    }>;
  };
}

export interface OfficeEvent {
  id: string;
  type: OfficeEventType;
  title: string;
  description: string;
  date: string;
  options: OfficeEventOption[];
  isHandled: boolean;
  expiresAt?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  type: 'MAIN' | 'SECONDARY' | 'MINOR';
  monthlyPayment: number;
  requirements: {
    minReputation: number;
    minPlayers?: number;
    minSuccessfulDeals?: number;
  };
  benefits: {
    reputationBonus?: number;
    negotiationBonus?: number;
    scoutingSpeedBonus?: number;
  };
  contractLength: number; // בחודשים
  active: boolean;
  startDate?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'SCOUT' | 'NEGOTIATOR' | 'ANALYST' | 'ASSISTANT';
  level: number;
  salary: number;
  skills: {
    scouting?: number;
    negotiation?: number;
    analysis?: number;
    management?: number;
  };
  benefits: {
    reputationBonus?: number;
    efficiencyBonus?: number;
    costReduction?: number;
  };
  contractEndDate: string;
  satisfaction: number;
  performance: number;
}

export interface RelationshipHistoryEntry {
  date: string;
  action: string;
  impact: number;
}

export interface Relationship {
  id: string;
  entityType: 'CLUB' | 'AGENT' | 'MEDIA' | 'SPONSOR';
  entityId: string;
  entityName: string;
  level: number; // -100 עד 100
  lastInteraction: string;
  history: RelationshipHistoryEntry[];
} 
