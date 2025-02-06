export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  reputation: number;
  balance: number;
  colors: {
    primary: string;
    secondary: string;
  };
  league: string;
  division: number;
  founded: number;
  rivals: string[];
  board: {
    patience: number;
    ambition: number;
    expectations: {
      league: number;
      cup: number;
    };
  };
  facilities: {
    stadium: number;
    training: number;
    youth: number;
    medical: number;
  };
  staff: {
    scouts: string[];
    coaches: string[];
    medical: string[];
  };
}

export interface TeamStats {
  league: {
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  cup: {
    round: string;
    played: number;
    won: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  season: {
    topScorer: {
      id: string;
      name: string;
      goals: number;
    };
    topAssister: {
      id: string;
      name: string;
      assists: number;
    };
    averageAttendance: number;
    totalIncome: number;
    totalExpenses: number;
  };
} 