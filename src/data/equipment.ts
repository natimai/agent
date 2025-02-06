import { EquipmentItem } from '../types/reputation';

// קטגוריות ציוד בסיסי - זמין מההתחלה
export const BASIC_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'basic_computer',
    name: 'מחשב בסיסי',
    type: 'TECH',
    cost: 2000,
    monthlyMaintenance: 100,
    reputationBonus: 1,
    minOfficeLevel: 1,
    benefits: {
      staffEfficiency: 5,
    },
    description: 'מחשב בסיסי לניהול משימות יומיומיות',
    durability: 12,
    condition: 100
  },
  {
    id: 'basic_phone',
    name: 'טלפון משרדי',
    type: 'TECH',
    cost: 1000,
    monthlyMaintenance: 50,
    reputationBonus: 1,
    minOfficeLevel: 1,
    benefits: {
      negotiationPower: 3,
    },
    description: 'טלפון משרדי לתקשורת עם לקוחות',
    durability: 24,
    condition: 100
  }
];

// ציוד רמה 2 - נפתח ברמת משרד 2
export const INTERMEDIATE_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'scouting_software',
    name: 'תוכנת סקאוטינג',
    type: 'TECH',
    cost: 5000,
    monthlyMaintenance: 250,
    reputationBonus: 3,
    minOfficeLevel: 2,
    benefits: {
      scoutingAccuracy: 10,
      staffEfficiency: 8,
    },
    description: 'תוכנה מתקדמת לניתוח שחקנים וסקאוטינג',
    durability: 18,
    condition: 100
  },
  {
    id: 'meeting_room',
    name: 'חדר ישיבות',
    type: 'OFFICE',
    cost: 8000,
    monthlyMaintenance: 300,
    reputationBonus: 5,
    minOfficeLevel: 2,
    benefits: {
      negotiationPower: 10,
      reputationBonus: 3,
    },
    description: 'חדר ישיבות מקצועי לפגישות עם שחקנים ומנהלים',
    durability: 36,
    condition: 100
  }
];

// ציוד רמה 3 - נפתח ברמת משרד 3
export const ADVANCED_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'analysis_center',
    name: 'מרכז ניתוח נתונים',
    type: 'TECH',
    cost: 15000,
    monthlyMaintenance: 500,
    reputationBonus: 8,
    minOfficeLevel: 3,
    benefits: {
      scoutingAccuracy: 20,
      staffEfficiency: 15,
      playerDevelopment: 10,
    },
    description: 'מערכת מתקדמת לניתוח נתונים וביצועי שחקנים',
    durability: 24,
    condition: 100
  },
  {
    id: 'training_facility',
    name: 'מתקן אימונים',
    type: 'TRAINING',
    cost: 25000,
    monthlyMaintenance: 1000,
    reputationBonus: 12,
    minOfficeLevel: 3,
    benefits: {
      playerDevelopment: 20,
      reputationBonus: 5,
    },
    description: 'מתקן אימונים מתקדם לפיתוח שחקנים',
    durability: 48,
    condition: 100
  }
];

// ציוד רמה 4 - נפתח ברמת משרד 4
export const PREMIUM_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'medical_center',
    name: 'מרכז רפואי',
    type: 'MEDICAL',
    cost: 35000,
    monthlyMaintenance: 1500,
    reputationBonus: 15,
    minOfficeLevel: 4,
    benefits: {
      playerDevelopment: 25,
      staffEfficiency: 20,
    },
    description: 'מרכז רפואי מתקדם לטיפול ומעקב אחר שחקנים',
    durability: 60,
    condition: 100
  },
  {
    id: 'vip_lounge',
    name: 'טרקלין VIP',
    type: 'OFFICE',
    cost: 50000,
    monthlyMaintenance: 2000,
    reputationBonus: 20,
    minOfficeLevel: 4,
    benefits: {
      negotiationPower: 25,
      reputationBonus: 10,
    },
    description: 'טרקלין יוקרתי לאירוח שחקנים ומנהלים בכירים',
    durability: 48,
    condition: 100
  }
];

// פונקציה להחזרת כל הציוד הזמין לרמת משרד מסוימת
export const getAvailableEquipment = (officeLevel: number): EquipmentItem[] => {
  let available: EquipmentItem[] = [...BASIC_EQUIPMENT];
  
  if (officeLevel >= 2) {
    available = [...available, ...INTERMEDIATE_EQUIPMENT];
  }
  if (officeLevel >= 3) {
    available = [...available, ...ADVANCED_EQUIPMENT];
  }
  if (officeLevel >= 4) {
    available = [...available, ...PREMIUM_EQUIPMENT];
  }
  
  return available;
};

// פונקציה לחישוב עלות התחזוקה החודשית הכוללת
export const calculateTotalMaintenance = (equipment: EquipmentItem[]): number => {
  return equipment.reduce((total, item) => total + item.monthlyMaintenance, 0);
};

// פונקציה לחישוב הבונוסים המצטברים מכל הציוד
export const calculateTotalBenefits = (equipment: EquipmentItem[]) => {
  return equipment.reduce((benefits, item) => {
    Object.entries(item.benefits).forEach(([key, value]) => {
      benefits[key] = (benefits[key] || 0) + value;
    });
    return benefits;
  }, {} as Record<string, number>);
};

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // ציוד משרדי
  {
    id: 'ergonomic-desk',
    name: 'שולחן עבודה ארגונומי',
    type: 'OFFICE',
    cost: 3000,
    monthlyMaintenance: 50,
    reputationBonus: 5,
    minOfficeLevel: 1,
    benefits: {
      staffEfficiency: 10,
      comfort: 15
    },
    description: 'שולחן עבודה מתכוונן עם מערכת ניהול כבלים ומשטח עבודה מרווח'
  },
  {
    id: 'executive-chair',
    name: 'כיסא מנהלים',
    type: 'OFFICE',
    cost: 2500,
    monthlyMaintenance: 40,
    reputationBonus: 4,
    minOfficeLevel: 1,
    benefits: {
      staffEfficiency: 8,
      comfort: 20
    },
    description: 'כיסא ארגונומי איכותי עם תמיכה מלאה לגב ומערכת כוונון מתקדמת'
  },
  {
    id: 'meeting-room',
    name: 'חדר ישיבות',
    type: 'OFFICE',
    cost: 15000,
    monthlyMaintenance: 300,
    reputationBonus: 15,
    minOfficeLevel: 2,
    benefits: {
      negotiationSuccess: 20,
      clientSatisfaction: 15
    },
    description: 'חדר ישיבות מאובזר עם שולחן גדול, כיסאות נוחים ומסך הקרנה'
  },
  {
    id: 'luxury-lounge',
    name: 'טרקלין יוקרה',
    type: 'OFFICE',
    cost: 45000,
    monthlyMaintenance: 1200,
    reputationBonus: 25,
    minOfficeLevel: 3,
    benefits: {
      negotiationSuccess: 30,
      clientSatisfaction: 25,
      reputationBonus: 15
    },
    description: 'טרקלין מפואר עם ריהוט יוקרתי, בר משקאות ונוף פנורמי'
  },
  {
    id: 'presentation-system',
    name: 'מערכת מצגות מתקדמת',
    type: 'OFFICE',
    cost: 8000,
    monthlyMaintenance: 150,
    reputationBonus: 8,
    minOfficeLevel: 2,
    benefits: {
      negotiationSuccess: 15,
      staffEfficiency: 10
    },
    description: 'מערכת מצגות חדישה עם מסך 4K, מקרן לייזר ומערכת סאונד היקפית'
  },

  // ציוד טכנולוגי
  {
    id: 'pro-laptop',
    name: 'מחשב נייד מתקדם',
    type: 'TECH',
    cost: 8000,
    monthlyMaintenance: 150,
    reputationBonus: 8,
    minOfficeLevel: 1,
    benefits: {
      productivity: 20,
      dataAnalysis: 15
    },
    description: 'מחשב נייד עוצמתי עם מעבד מתקדם וכרטיס מסך חזק'
  },
  {
    id: 'dual-monitors',
    name: 'מערכת מסכים כפולה',
    type: 'TECH',
    cost: 4000,
    monthlyMaintenance: 80,
    reputationBonus: 6,
    minOfficeLevel: 1,
    benefits: {
      productivity: 25,
      staffEfficiency: 15
    },
    description: 'שני מסכי 4K מקצועיים לעבודה יעילה יותר'
  },
  {
    id: 'analysis-software',
    name: 'תוכנת ניתוח מתקדמת',
    type: 'TECH',
    cost: 12000,
    monthlyMaintenance: 250,
    reputationBonus: 12,
    minOfficeLevel: 2,
    benefits: {
      scoutingAccuracy: 30,
      dataAnalysis: 25
    },
    description: 'תוכנה מתקדמת לניתוח נתונים וביצועי שחקנים'
  },
  {
    id: 'ai-scouting-system',
    name: 'מערכת סקאוטינג AI',
    type: 'TECH',
    cost: 25000,
    monthlyMaintenance: 500,
    reputationBonus: 20,
    minOfficeLevel: 3,
    benefits: {
      scoutingAccuracy: 40,
      dataAnalysis: 35,
      productivity: 20
    },
    description: 'מערכת סקאוטינג מבוססת בינה מלאכותית לזיהוי כישרונות צעירים'
  },
  {
    id: 'video-analysis-suite',
    name: 'מערכת ניתוח וידאו',
    type: 'TECH',
    cost: 18000,
    monthlyMaintenance: 350,
    reputationBonus: 15,
    minOfficeLevel: 2,
    benefits: {
      scoutingAccuracy: 25,
      playerDevelopment: 20,
      dataAnalysis: 30
    },
    description: 'מערכת מתקדמת לניתוח משחקים ומשחקי שחקנים בווידאו'
  },

  // ציוד אימונים
  {
    id: 'training-facility',
    name: 'מתקן אימונים',
    type: 'TRAINING',
    cost: 35000,
    monthlyMaintenance: 1000,
    reputationBonus: 25,
    minOfficeLevel: 3,
    benefits: {
      playerDevelopment: 30,
      injuryPrevention: 20
    },
    description: 'מתקן אימונים מקצועי עם ציוד מתקדם ומגרש אימונים'
  },
  {
    id: 'gym-equipment',
    name: 'חדר כושר',
    type: 'TRAINING',
    cost: 20000,
    monthlyMaintenance: 500,
    reputationBonus: 15,
    minOfficeLevel: 2,
    benefits: {
      playerDevelopment: 20,
      injuryPrevention: 15
    },
    description: 'חדר כושר מאובזר עם ציוד מתקדם לאימון שחקנים'
  },
  {
    id: 'recovery-zone',
    name: 'אזור התאוששות',
    type: 'TRAINING',
    cost: 15000,
    monthlyMaintenance: 300,
    reputationBonus: 10,
    minOfficeLevel: 2,
    benefits: {
      recoverySpeed: 25,
      playerDevelopment: 10
    },
    description: 'אזור התאוששות עם בריכת קרח, ג׳קוזי וציוד עיסוי'
  },
  {
    id: 'performance-lab',
    name: 'מעבדת ביצועים',
    type: 'TRAINING',
    cost: 40000,
    monthlyMaintenance: 800,
    reputationBonus: 22,
    minOfficeLevel: 3,
    benefits: {
      playerDevelopment: 35,
      injuryPrevention: 25,
      dataAnalysis: 20
    },
    description: 'מעבדה מתקדמת למדידת ביצועים פיזיולוגיים ואנליזה של שחקנים'
  },
  {
    id: 'indoor-training',
    name: 'מגרש אימונים מקורה',
    type: 'TRAINING',
    cost: 50000,
    monthlyMaintenance: 1500,
    reputationBonus: 30,
    minOfficeLevel: 4,
    benefits: {
      playerDevelopment: 40,
      recoverySpeed: 20,
      injuryPrevention: 15
    },
    description: 'מגרש אימונים מקורה עם דשא סינטטי ומערכת בקרת אקלים'
  },

  // ציוד רפואי
  {
    id: 'medical-room',
    name: 'חדר טיפולים',
    type: 'MEDICAL',
    cost: 25000,
    monthlyMaintenance: 600,
    reputationBonus: 20,
    minOfficeLevel: 3,
    benefits: {
      injuryPrevention: 25,
      recoverySpeed: 20
    },
    description: 'חדר טיפולים מאובזר עם ציוד רפואי מתקדם'
  },
  {
    id: 'physio-equipment',
    name: 'ציוד פיזיותרפיה',
    type: 'MEDICAL',
    cost: 15000,
    monthlyMaintenance: 300,
    reputationBonus: 12,
    minOfficeLevel: 2,
    benefits: {
      injuryPrevention: 20,
      recoverySpeed: 15
    },
    description: 'ציוד פיזיותרפיה מקצועי לטיפול ומניעת פציעות'
  },
  {
    id: 'diagnostic-system',
    name: 'מערכת אבחון',
    type: 'MEDICAL',
    cost: 30000,
    monthlyMaintenance: 800,
    reputationBonus: 18,
    minOfficeLevel: 3,
    benefits: {
      injuryPrevention: 30,
      dataAnalysis: 20
    },
    description: 'מערכת אבחון מתקדמת לזיהוי מוקדם של פציעות ומעקב אחר החלמה'
  },
  {
    id: 'rehab-center',
    name: 'מרכז שיקום',
    type: 'MEDICAL',
    cost: 45000,
    monthlyMaintenance: 1200,
    reputationBonus: 28,
    minOfficeLevel: 4,
    benefits: {
      recoverySpeed: 35,
      injuryPrevention: 25,
      playerDevelopment: 15
    },
    description: 'מרכז שיקום מתקדם עם ציוד טיפולי חדשני ובריכת שיקום'
  },
  {
    id: 'sports-science-lab',
    name: 'מעבדה לרפואת ספורט',
    type: 'MEDICAL',
    cost: 55000,
    monthlyMaintenance: 1500,
    reputationBonus: 35,
    minOfficeLevel: 4,
    benefits: {
      injuryPrevention: 40,
      recoverySpeed: 30,
      dataAnalysis: 25
    },
    description: 'מעבדה מתקדמת לרפואת ספורט עם ציוד דיאגנוסטי מתקדם ומערכות מעקב'
  }
];