export type Position = 
  | 'GK'  // Goalkeeper
  | 'CB'  // Center Back
  | 'LB'  // Left Back
  | 'RB'  // Right Back
  | 'DM'  // Defensive Midfielder
  | 'CDM' // Central Defensive Midfielder
  | 'CM'  // Central Midfielder
  | 'LM'  // Left Midfielder
  | 'RM'  // Right Midfielder
  | 'AM'  // Attacking Midfielder
  | 'CAM' // Central Attacking Midfielder
  | 'LW'  // Left Wing
  | 'RW'  // Right Wing
  | 'ST'; // Striker

export const ALL_POSITIONS: Position[] = [
  'GK',
  'CB',
  'LB',
  'RB',
  'DM',
  'CDM',
  'CM',
  'LM',
  'RM',
  'AM',
  'CAM',
  'LW',
  'RW',
  'ST'
];

export const POSITION_NAMES: Record<Position, string> = {
  GK: 'שוער',
  CB: 'בלם מרכזי',
  LB: 'מגן שמאלי',
  RB: 'מגן ימני',
  DM: 'קשר הגנתי',
  CDM: 'קשר הגנתי מרכזי',
  CM: 'קשר מרכזי',
  LM: 'קשר שמאלי',
  RM: 'קשר ימני',
  AM: 'קשר התקפי',
  CAM: 'קשר התקפי מרכזי',
  LW: 'מקצה שמאלי',
  RW: 'מקצה ימני',
  ST: 'חלוץ'
};

export interface PositionAttributes {
  main: Position;
  secondary?: Position[];
} 