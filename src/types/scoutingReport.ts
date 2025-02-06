export interface ScoutingReport {
  id: string;
  playerId: string;
  scoutId: string;
  date: string;
  accuracy: number; // 1-100
  observations: {
    attribute: keyof PlayerAttributes;
    estimatedValue: number;
    confidence: number; // 1-100
    notes?: string;
  }[];
  recommendations: {
    type: 'BUY' | 'MONITOR' | 'AVOID';
    reason: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  comparisons: {
    playerId: string;
    similarity: number; // 1-100
    aspects: string[];
  }[];
} 