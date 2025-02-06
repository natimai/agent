import { Country, CountryPlayerStyle } from '../types/country';
import { Position } from '../types/position';
import { generateNameByCountry } from '../utils/nameGenerators';

const countryStyles: Record<string, CountryPlayerStyle> = {
  IL: {
    attributes: {
      passing: 1.1,
      dribbling: 1.1,
      physical: 0.9
    },
    description: 'טכניקה טובה ויצירתיות'
  },
  ES: {
    attributes: {
      passing: 1.2,
      dribbling: 1.2,
      physical: 0.8
    },
    description: 'טיקי-טאקה וטכניקה מעולה'
  },
  IT: {
    attributes: {
      defending: 1.2,
      physical: 1.1,
      pace: 0.9
    },
    description: 'הגנה חזקה וטקטיקה'
  },
  ENG: {
    attributes: {
      pace: 1.1,
      physical: 1.2,
      shooting: 1.1
    },
    description: 'כדורגל מהיר ופיזי'
  },
  ITA: {
    attributes: {
      defending: 1.2,
      physical: 1.1,
      passing: 1.1,
      pace: 0.9
    },
    description: 'מצטיינים בהגנה וטקטיקה'
  },
  ESP: {
    attributes: {
      passing: 1.2,
      dribbling: 1.2,
      shooting: 0.9,
      physical: 0.8
    },
    description: 'טיקי-טאקה ושליטה בכדור'
  },
  ARG: {
    attributes: {
      dribbling: 1.3,
      shooting: 1.2,
      passing: 1.1,
      defending: 0.8
    },
    description: 'יצירתיות והתקפה'
  },
  BRA: {
    attributes: {
      dribbling: 1.3,
      pace: 1.2,
      shooting: 1.1,
      defending: 0.8
    },
    description: 'כדורגל יצירתי וקסום'
  },
  FRA: {
    attributes: {
      pace: 1.2,
      physical: 1.1,
      dribbling: 1.1,
      passing: 1.1
    },
    description: 'אתלטיות וטכניקה'
  },
  GER: {
    attributes: {
      physical: 1.1,
      passing: 1.1,
      shooting: 1.1,
      defending: 1.1
    },
    description: 'יעילות וסדר טקטי'
  }
};

export const countries: Country[] = [
  {
    id: 'IL',
    code: 'IL',
    name: 'ישראל',
    type: 'LOCAL',
    specialties: ['CM', 'CAM'] as Position[],
    baseRatingRange: { min: 60, max: 75 },
    scoutingCost: 5000,
    style: countryStyles.IL
  },
  {
    id: 'IT',
    code: 'IT',
    name: 'איטליה',
    type: 'CONTINENTAL',
    specialties: ['CB', 'CDM'] as Position[],
    baseRatingRange: { min: 65, max: 85 },
    scoutingCost: 7000,
    style: countryStyles.IT
  },
  {
    id: 'ES',
    code: 'ES',
    name: 'ספרד',
    type: 'CONTINENTAL',
    specialties: ['CM', 'CAM'] as Position[],
    baseRatingRange: { min: 65, max: 85 },
    scoutingCost: 7500,
    style: countryStyles.ES
  },
  {
    id: 'ENG',
    code: 'ENG',
    name: 'אנגליה',
    type: 'CONTINENTAL',
    specialties: ['ST', 'RW', 'LW'] as Position[],
    baseRatingRange: { min: 65, max: 85 },
    scoutingCost: 8000,
    style: countryStyles.ENG
  },
  // ... המשך המדינות
]; 