import { PlayerAttributes } from '../types/player';

export const calculatePlayerValue = (params: {
  age: number;
  attributes: PlayerAttributes;
  potential: number;
}): number => {
  const { age, attributes, potential } = params;
  
  const averageRating = Object.values(attributes).reduce((sum, val) => sum + val, 0) / 6;
  const baseValue = Math.pow(averageRating, 2) * 1000;
  
  // מכפילי גיל
  let ageMultiplier = 1;
  if (age < 21) ageMultiplier = 1.5;
  else if (age > 30) ageMultiplier = 0.7;
  
  // מכפיל פוטנציאל
  const potentialMultiplier = 1 + (potential - averageRating) / 100;
  
  return Math.floor(baseValue * ageMultiplier * potentialMultiplier);
}; 