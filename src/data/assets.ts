import { Property, Vehicle, LuxuryItem } from '../types/assets';

export const PROPERTIES: Property[] = [
  {
    id: 'luxury-apartment',
    name: 'דירת יוקרה',
    type: 'PROPERTY',
    propertyType: 'APARTMENT',
    cost: 2500000,
    monthlyMaintenance: 5000,
    reputationBonus: 25,
    size: 150,
    location: 'תל אביב - רמת אביב',
    description: 'דירת יוקרה מרהיבה עם נוף לים',
    amenities: ['מרפסת שמש', 'חניה כפולה', 'מועדון דיירים', 'בריכה'],
    benefits: {
      prestige: 20,
      networking: 15,
      clientTrust: 10
    },
    requirements: {
      minReputation: 1000,
      minLevel: 3
    }
  },
  {
    id: 'penthouse',
    name: 'פנטהאוז יוקרתי',
    type: 'PROPERTY',
    propertyType: 'PENTHOUSE',
    cost: 5000000,
    monthlyMaintenance: 8000,
    reputationBonus: 40,
    size: 250,
    location: 'תל אביב - פארק צמרת',
    description: 'פנטהאוז מפואר עם נוף פנורמי',
    amenities: ['גג פרטי', 'בריכה פרטית', 'חדר כושר', 'חניה תת קרקעית'],
    benefits: {
      prestige: 35,
      networking: 25,
      clientTrust: 20
    },
    requirements: {
      minReputation: 2000,
      minLevel: 4
    }
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'luxury-suv',
    name: 'רכב שטח יוקרתי',
    type: 'VEHICLE',
    vehicleType: 'SUV',
    brand: 'Mercedes-Benz',
    model: 'GLE',
    year: 2024,
    cost: 500000,
    monthlyMaintenance: 3000,
    reputationBonus: 15,
    description: 'רכב שטח יוקרתי ומרשים',
    features: ['מערכת בידור מתקדמת', 'ריפודי עור', 'מערכות בטיחות מתקדמות'],
    benefits: {
      mobility: 15,
      prestige: 10,
      clientImpression: 8
    },
    requirements: {
      minReputation: 500,
      minLevel: 2
    }
  },
  {
    id: 'sports-car',
    name: 'מכונית ספורט',
    type: 'VEHICLE',
    vehicleType: 'SPORTS_CAR',
    brand: 'Porsche',
    model: '911',
    year: 2024,
    cost: 1000000,
    monthlyMaintenance: 5000,
    reputationBonus: 25,
    description: 'מכונית ספורט מהירה ומרשימה',
    features: ['מנוע טורבו', 'חבילת ספורט', 'מערכת שמע היקפית'],
    benefits: {
      prestige: 25,
      clientImpression: 20,
      networking: 15
    },
    requirements: {
      minReputation: 1500,
      minLevel: 3
    }
  }
];

export const LUXURY_ITEMS: LuxuryItem[] = [
  {
    id: 'luxury-watch',
    name: 'שעון יוקרה',
    type: 'LUXURY',
    category: 'WATCH',
    brand: 'Rolex',
    cost: 100000,
    monthlyMaintenance: 500,
    reputationBonus: 10,
    description: 'שעון יוקרה מבית רולקס',
    rarity: 'EXCLUSIVE',
    benefits: {
      prestige: 8,
      clientImpression: 5,
      negotiationPower: 3
    },
    requirements: {
      minReputation: 300,
      minLevel: 2
    }
  },
  {
    id: 'art-collection',
    name: 'אוסף אמנות',
    type: 'LUXURY',
    category: 'ART',
    cost: 300000,
    monthlyMaintenance: 1000,
    reputationBonus: 15,
    description: 'אוסף יצירות אמנות ייחודי',
    rarity: 'RARE',
    benefits: {
      prestige: 12,
      culturalCapital: 10,
      clientTrust: 8
    },
    requirements: {
      minReputation: 800,
      minLevel: 3
    }
  }
]; 