export interface OfficeLevel {
  id: number;
  level: number;
  name: string;
  description: string;
  maxPlayers: number;
  maxScouts: number;
  requiredBudget: number;
  requiredReputation: number;
  commissionBonus: number;
  reputationBonus: number;
  upgradeCost: number;
  benefits: {
    negotiationBonus: number;
    scoutingSpeedBonus: number;
    reputationBonus: number;
  };
}

export interface OfficeBenefits {
  negotiationBonus: number;
  reputationGain: number;
  transferFeeBonus: number;
  scoutingSpeedBonus: number;
}

export interface OfficeStats {
  totalTransfers: number;
  totalCommissions: number;
  activeNegotiations: number;
  reputation: number;
}

export interface MonthlyReport {
  date: string;
  income: {
    commissions: number;
    sponsorships: number;
    bonuses: number;
    other: number;
  };
  expenses: {
    rent: number;
    utilities: number;
    salaries: number;
    misc: number;
  };
  balance: number;
  stats: {
    totalTransfers: number;
    successfulDeals: number;
    failedDeals: number;
    activeNegotiations: number;
  };
}

export interface OfficeState {
  currentLevel: number;
  stats: OfficeStats;
  monthlyReports: MonthlyReport[];
}

export const OFFICE_LEVELS: OfficeLevel[] = [
  {
    level: 1,
    name: 'משרד מתחיל',
    description: 'משרד קטן ובסיסי לסוכן מתחיל',
    maxPlayers: 5,
    maxScouts: 1,
    maxStaff: 2,
    commissionRate: 5,
    monthlyExpenses: 5000,
    upgradeCost: 50000,
    requiredReputation: 20,
    benefits: {
      negotiationBonus: 0,
      reputationBonus: 0,
      scoutingSpeedBonus: 0
    }
  },
  {
    level: 2,
    name: 'משרד מתפתח',
    description: 'משרד בינוני עם יכולות מורחבות',
    maxPlayers: 10,
    maxScouts: 2,
    maxStaff: 4,
    commissionRate: 7,
    monthlyExpenses: 12000,
    upgradeCost: 150000,
    requiredReputation: 50,
    benefits: {
      negotiationBonus: 5,
      reputationBonus: 5,
      scoutingSpeedBonus: 10
    }
  },
  {
    level: 3,
    name: 'משרד מקצועי',
    description: 'משרד גדול עם צוות מקצועי',
    maxPlayers: 20,
    maxScouts: 4,
    maxStaff: 8,
    commissionRate: 10,
    monthlyExpenses: 25000,
    upgradeCost: 500000,
    requiredReputation: 100,
    benefits: {
      negotiationBonus: 10,
      reputationBonus: 10,
      scoutingSpeedBonus: 20
    }
  },
  {
    level: 4,
    name: 'משרד יוקרתי',
    description: 'משרד מוביל עם מוניטין גבוה',
    maxPlayers: 35,
    maxScouts: 6,
    maxStaff: 12,
    commissionRate: 12,
    monthlyExpenses: 50000,
    upgradeCost: 1500000,
    requiredReputation: 200,
    benefits: {
      negotiationBonus: 15,
      reputationBonus: 20,
      scoutingSpeedBonus: 30
    }
  },
  {
    level: 5,
    name: 'משרד עילית',
    description: 'משרד ברמה הגבוהה ביותר',
    maxPlayers: 50,
    maxScouts: 8,
    maxStaff: 16,
    commissionRate: 15,
    monthlyExpenses: 100000,
    upgradeCost: 5000000,
    requiredReputation: 500,
    benefits: {
      negotiationBonus: 25,
      reputationBonus: 30,
      scoutingSpeedBonus: 50
    }
  }
]; 