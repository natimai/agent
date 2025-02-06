import { Position } from './position';
import { PlayerAttributes } from './player';

export interface Country {
  id: string;
  code: string;
  name: string;
  type: 'LOCAL' | 'NEARBY' | 'CONTINENTAL' | 'INTERNATIONAL';
  specialties: Position[];
  baseRatingRange: {
    min: number;
    max: number;
  };
  scoutingCost: number;
  style: CountryPlayerStyle;
}

export interface CountryPlayerStyle {
  attributes: Partial<Record<keyof PlayerAttributes, number>>;
  description: string;
} 