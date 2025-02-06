export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';

export const ALL_POSITIONS: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];

export const POSITION_NAMES: Record<Position, string> = {
  GK: 'שוער',
  CB: 'בלם מרכזי',
  LB: 'מגן שמאלי',
  RB: 'מגן ימני',
  CDM: 'קשר אחורי',
  CM: 'קשר מרכזי',
  CAM: 'קשר התקפי',
  LW: 'מקצה שמאלי',
  RW: 'מקצה ימני',
  ST: 'חלוץ'
};

export interface PositionAttributes {
  main: Position;
  secondary?: Position[];
} 