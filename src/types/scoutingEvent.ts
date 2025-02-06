export type ScoutingEventType = 
  | 'WONDERKID_FOUND' // מציאת כישרון צעיר נדיר
  | 'HIDDEN_GEM' // שחקן לא מוכר עם פוטנציאל גבוה
  | 'BIDDING_WAR' // תחרות מול קבוצות אחרות
  | 'LOCAL_CONNECTION' // קשר מקומי שיכול לעזור במציאת שחקנים
  | 'TOURNAMENT_ACCESS'; // גישה לטורניר נוער מקומי

export interface ScoutingEvent {
  type: ScoutingEventType;
  countryId: string;
  description: string;
  options: {
    text: string;
    action: () => void;
    cost?: number;
    successChance?: number;
  }[];
} 