export interface OfficeLevel {
  level: number;
  name: string;
  description: string;
  maxPlayers: number;
  maxStaff: number;
  maxScouts: number;
  commissionRate: number;
  monthlyExpenses: number;
  upgradeCost: number;
  requiredBudget: number;
  requiredReputation: number;
  benefits: {
    reputationBonus: number;
    scoutingBonus: number;
    negotiationBonus: number;
    commissionBonus: number;
  };
  requirements: {
    budget: number;
    reputation: number;
  };
}

export interface OfficeBenefits {
  reputationBonus: number;
  scoutingBonus: number;
  negotiationBonus: number;
  commissionBonus: number;
}

export interface OfficeStats {
  totalTransfers: number;
  successfulNegotiations: number;
  failedNegotiations: number;
  totalSpent: number;
  totalEarned: number;
  averageTransferValue: number;
  totalCommissions: number;
  activeNegotiations: number;
  reputation: number;
  bestTransfer: {
    playerId: string;
    playerName: string;
    amount: number;
    date: string;
  };
}

export interface MonthlyReport {
  month: number;
  year: number;
  date: string;
  transfers: {
    in: number;
    out: number;
    spent: number;
    earned: number;
  };
  negotiations: {
    successful: number;
    failed: number;
  };
  expenses: number;
  revenue: number;
  income: {
    commissions: number;
    sponsorships: number;
    bonuses: number;
    other: number;
  };
  balance: number;
  stats: {
    totalTransfers: number;
    successfulDeals: number;
    failedDeals: number;
    activeNegotiations: number;
  };
}

export interface ExtendedOfficeState {
  level: OfficeLevel;
  currentLevel: number;
  experience: number;
  lastUpgrade: string;
  stats: OfficeStats;
  monthlyReports: MonthlyReport[];
  events: any[];
  sponsors: any[];
  staff: any[];
  relationships: any[];
  activeSponsors: any[];
  budget: number;
}

export const OFFICE_LEVELS: OfficeLevel[] = [
  {
    level: 1,
    name: 'משרד מתחיל',
    description: 'משרד בסיסי עם ציוד מינימלי',
    maxPlayers: 10,
    maxStaff: 2,
    maxScouts: 2,
    commissionRate: 5,
    monthlyExpenses: 10000,
    upgradeCost: 100000,
    requiredBudget: 0,
    requiredReputation: 0,
    benefits: {
      reputationBonus: 0,
      scoutingBonus: 0,
      negotiationBonus: 0,
      commissionBonus: 0
    },
    requirements: {
      budget: 0,
      reputation: 0
    }
  },
  {
    level: 2,
    name: 'משרד מקצועי',
    description: 'משרד מאובזר עם ציוד מקצועי',
    maxPlayers: 20,
    maxStaff: 4,
    maxScouts: 4,
    commissionRate: 7,
    monthlyExpenses: 25000,
    upgradeCost: 250000,
    requiredBudget: 500000,
    requiredReputation: 20,
    benefits: {
      reputationBonus: 5,
      scoutingBonus: 10,
      negotiationBonus: 5,
      commissionBonus: 2
    },
    requirements: {
      budget: 500000,
      reputation: 20
    }
  },
  {
    level: 3,
    name: 'משרד מתקדם',
    description: 'משרד מודרני עם טכנולוגיה מתקדמת',
    maxPlayers: 35,
    maxStaff: 7,
    maxScouts: 7,
    commissionRate: 10,
    monthlyExpenses: 50000,
    upgradeCost: 500000,
    requiredBudget: 2000000,
    requiredReputation: 40,
    benefits: {
      reputationBonus: 10,
      scoutingBonus: 20,
      negotiationBonus: 10,
      commissionBonus: 5
    },
    requirements: {
      budget: 2000000,
      reputation: 40
    }
  },
  {
    level: 4,
    name: 'משרד יוקרתי',
    description: 'משרד מפואר עם מיטב הציוד והטכנולוגיה',
    maxPlayers: 50,
    maxStaff: 10,
    maxScouts: 10,
    commissionRate: 12,
    monthlyExpenses: 100000,
    upgradeCost: 1000000,
    requiredBudget: 5000000,
    requiredReputation: 60,
    benefits: {
      reputationBonus: 20,
      scoutingBonus: 30,
      negotiationBonus: 20,
      commissionBonus: 8
    },
    requirements: {
      budget: 5000000,
      reputation: 60
    }
  },
  {
    level: 5,
    name: 'משרד עילית',
    description: 'משרד ברמה הגבוהה ביותר עם כל האמצעים האפשריים',
    maxPlayers: 75,
    maxStaff: 15,
    maxScouts: 15,
    commissionRate: 15,
    monthlyExpenses: 200000,
    upgradeCost: 2000000,
    requiredBudget: 10000000,
    requiredReputation: 80,
    benefits: {
      reputationBonus: 30,
      scoutingBonus: 50,
      negotiationBonus: 30,
      commissionBonus: 12
    },
    requirements: {
      budget: 10000000,
      reputation: 80
    }
  }
]; 