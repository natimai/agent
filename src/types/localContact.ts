export interface LocalContact {
  id: string;
  countryId: string;
  name: string;
  influence: number; // 1-100
  trust: number; // 1-100
  services: {
    type: 'INFO' | 'ACCESS' | 'NEGOTIATION';
    description: string;
    cost: number;
    cooldown: number; // ימים
  }[];
  lastUsed?: string; // תאריך
} 