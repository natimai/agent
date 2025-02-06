export interface YouthTournament {
  id: string;
  name: string;
  countryId: string;
  startDate: string;
  duration: number; // ימים
  level: 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL';
  teamsCount: number;
  prospects: {
    playerId: string;
    potential: number;
    observationCost: number;
  }[];
  accessCost: number;
} 