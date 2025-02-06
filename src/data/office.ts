import { OfficeLevel } from '../types/office';

export const OFFICE_LEVELS: OfficeLevel[] = [
  {
    id: 1,
    level: 1,
    name: "משרד מתחיל",
    description: "משרד בסיסי לסוכן מתחיל",
    maxPlayers: 5,
    maxScouts: 1,
    requiredBudget: 0,
    requiredReputation: 0,
    commissionBonus: 0,
    reputationBonus: 0,
    upgradeCost: 50000,
    benefits: {
      negotiationBonus: 0,
      scoutingSpeedBonus: 0,
      reputationBonus: 0
    }
  },
  {
    id: 2,
    level: 2,
    name: "משרד מקצועי",
    description: "משרד עם יכולות מורחבות",
    maxPlayers: 10,
    maxScouts: 2,
    requiredBudget: 100000,
    requiredReputation: 20,
    commissionBonus: 5,
    reputationBonus: 2,
    upgradeCost: 100000,
    benefits: {
      negotiationBonus: 5,
      scoutingSpeedBonus: 10,
      reputationBonus: 2
    }
  },
  {
    id: 3,
    level: 3,
    name: "משרד מתקדם",
    description: "משרד מודרני עם צוות מקצועי",
    maxPlayers: 20,
    maxScouts: 3,
    requiredBudget: 250000,
    requiredReputation: 50,
    commissionBonus: 10,
    reputationBonus: 5,
    upgradeCost: 250000,
    benefits: {
      negotiationBonus: 10,
      scoutingSpeedBonus: 20,
      reputationBonus: 5
    }
  },
  {
    id: 4,
    level: 4,
    name: "משרד יוקרתי",
    description: "משרד ברמה בינלאומית",
    maxPlayers: 35,
    maxScouts: 5,
    requiredBudget: 500000,
    requiredReputation: 100,
    commissionBonus: 15,
    reputationBonus: 10,
    upgradeCost: 500000,
    benefits: {
      negotiationBonus: 15,
      scoutingSpeedBonus: 30,
      reputationBonus: 10
    }
  },
  {
    id: 5,
    level: 5,
    name: "משרד עילית",
    description: "משרד ברמה העולמית הגבוהה ביותר",
    maxPlayers: 50,
    maxScouts: 8,
    requiredBudget: 1000000,
    requiredReputation: 200,
    commissionBonus: 20,
    reputationBonus: 15,
    upgradeCost: 1000000,
    benefits: {
      negotiationBonus: 20,
      scoutingSpeedBonus: 40,
      reputationBonus: 15
    }
  }
]; 
