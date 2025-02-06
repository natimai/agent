import { Position } from './position';

export interface Scout {
  id: string;
  name: string;
  level: number;
  salary: number;
  lastPaidDate: string;
  experience: number;
  specialization: 'youth' | 'senior' | 'both';
  regions: string[];
  scoutingProgress?: number;
  operationalCosts: {
    baseDaily: number;
    travelMultiplier: number; // מכפיל עלות לפי מרחק
  };
  abilities: {
    evaluation: number;  // יכולת הערכת שחקנים
    negotiation: number; // יכולת משא ומתן
    youth: number;       // התמחות בשחקני נוער
  };
  specialties: Position[];
  preferredCountries: string[];
  currentMission?: {
    countryId: string;
    startDate: string;
    duration: number;
    cost: number;
  };
  stats: {
    successfulFinds: number;
    reportsSubmitted: number;
    accuracy: number;
    successfulMissions: number;
    failedMissions: number;
    playersDiscovered: number;
    averageReportAccuracy: number;
  };
  contract: {
    startDate: string;
    endDate: string;
  };
}

export interface ScoutMissionCosts {
  salary: number;
  operationalCosts: number;
  travelCosts: number;
  total: number;
} 