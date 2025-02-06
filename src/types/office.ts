export interface OfficeLevel {
  level: number;
  name: string;
  description: string;
  maxPlayers: number;
  maxStaff: number;
  commissionRate: number;
  monthlyExpenses: number;
  upgradeCost: number;
  benefits: {
    reputationBonus: number;
    scoutingBonus: number;
    negotiationBonus: number;
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
}

export interface OfficeStats {
  totalTransfers: number;
  successfulNegotiations: number;
  failedNegotiations: number;
  totalSpent: number;
  totalEarned: number;
  averageTransferValue: number;
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
}

export interface ExtendedOfficeState {
  level: OfficeLevel;
  experience: number;
  lastUpgrade: string;
  stats: OfficeStats;
  monthlyReports: MonthlyReport[];
}

export const OFFICE_LEVELS: OfficeLevel[] = [
  {
    level: 1,
    name: 'משרד מתחיל',
    description: 'משרד בסיסי עם ציוד מינימלי',
    maxPlayers: 10,
    maxStaff: 2,
    commissionRate: 5,
    monthlyExpenses: 10000,
    upgradeCost: 100000,
    benefits: {
      reputationBonus: 0,
      scoutingBonus: 0,
      negotiationBonus: 0
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
    commissionRate: 7,
    monthlyExpenses: 25000,
    upgradeCost: 250000,
    benefits: {
      reputationBonus: 5,
      scoutingBonus: 10,
      negotiationBonus: 5
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
    commissionRate: 10,
    monthlyExpenses: 50000,
    upgradeCost: 500000,
    benefits: {
      reputationBonus: 10,
      scoutingBonus: 20,
      negotiationBonus: 10
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
    commissionRate: 12,
    monthlyExpenses: 100000,
    upgradeCost: 1000000,
    benefits: {
      reputationBonus: 20,
      scoutingBonus: 30,
      negotiationBonus: 20
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
    commissionRate: 15,
    monthlyExpenses: 200000,
    upgradeCost: 2000000,
    benefits: {
      reputationBonus: 30,
      scoutingBonus: 50,
      negotiationBonus: 30
    },
    requirements: {
      budget: 10000000,
      reputation: 80
    }
  }
]; 