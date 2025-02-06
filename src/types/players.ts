export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerStats {
  matches: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  appearances?: number;
  minutesPlayed?: number;
  averageRating?: number;
}

export interface PlayerInjury {
  type: string;
  startDate: string;
  expectedEndDate: string;
  status: 'ACTIVE' | 'RECOVERED';
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
}

export interface LastMatch {
  date: string;
  opponent: string;
  result: string;
  goals: number;
  assists: number;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  nationality: string;
  birthDate: string;
  height: number;
  weight: number;
  value: number;
  salary: number;
  contractStart: string;
  contractEnd: string;
  team: string;
  avatar?: string;
  isHot: boolean;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  form: number;
  potential: number;
  marketValue: number;
  injuries: PlayerInjury[];
  lastMatch?: LastMatch;
}

export interface PlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
  filters: {
    position: string | null;
    minAge: number | null;
    maxAge: number | null;
    minValue: number | null;
    maxValue: number | null;
    nationality: string | null;
  };
  sort: {
    field: keyof Player | null;
    direction: 'asc' | 'desc';
  };
} 