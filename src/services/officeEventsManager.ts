import { v4 as uuidv4 } from 'uuid';
import { OfficeEvent, OfficeEventType, Sponsor } from '../types/officeEvents';
import { OfficeLevel } from '../types/office';
import store from '../store';
import { addEvent } from '../store/slices/officeSlice';

const SPONSOR_NAMES = [
  'ספורט פלוס',
  'ווינר',
  'נייקי ישראל',
  'אדידס',
  'פומה',
  'בנק הפועלים',
  'בנק לאומי',
  'YES',
  'HOT',
  'סלקום',
  'פרטנר'
];

const MEDIA_OUTLETS = [
  'ספורט 5',
  'ONE',
  'וואלה! ספורט',
  'ynet ספורט',
  'ערוץ הספורט'
];

const generateSponsorOffer = (currentLevel: number): OfficeEvent => {
  const sponsorType = Math.random() > 0.7 ? 'MAIN' : Math.random() > 0.5 ? 'SECONDARY' : 'MINOR';
  const sponsorName = SPONSOR_NAMES[Math.floor(Math.random() * SPONSOR_NAMES.length)];
  const monthlyPayment = sponsorType === 'MAIN' ? 
    Math.floor(Math.random() * 50000) + 50000 :
    sponsorType === 'SECONDARY' ?
    Math.floor(Math.random() * 30000) + 20000 :
    Math.floor(Math.random() * 10000) + 5000;

  const sponsor: Sponsor = {
    id: uuidv4(),
    name: sponsorName,
    type: sponsorType,
    monthlyPayment,
    requirements: {
      minReputation: sponsorType === 'MAIN' ? 100 : sponsorType === 'SECONDARY' ? 50 : 20,
      minPlayers: sponsorType === 'MAIN' ? 15 : sponsorType === 'SECONDARY' ? 10 : 5
    },
    benefits: {
      reputationBonus: sponsorType === 'MAIN' ? 15 : sponsorType === 'SECONDARY' ? 10 : 5,
      negotiationBonus: sponsorType === 'MAIN' ? 10 : sponsorType === 'SECONDARY' ? 5 : 2,
      scoutingSpeedBonus: sponsorType === 'MAIN' ? 20 : sponsorType === 'SECONDARY' ? 10 : 5
    },
    contractLength: sponsorType === 'MAIN' ? 12 : sponsorType === 'SECONDARY' ? 6 : 3,
    active: false
  };

  return {
    id: uuidv4(),
    type: 'SPONSOR_OFFER',
    title: `הצעת חסות מ${sponsorName}`,
    description: `${sponsorName} מעוניינים להציע לך חוזה חסות ${
      sponsorType === 'MAIN' ? 'ראשי' : sponsorType === 'SECONDARY' ? 'משני' : 'קטן'
    } לתקופה של ${sponsor.contractLength} חודשים`,
    date: new Date().toISOString(),
    options: [
      {
        id: uuidv4(),
        text: 'קבל את ההצעה',
        effects: {
          treasury: monthlyPayment,
          reputation: sponsor.benefits.reputationBonus,
          relationships: [
            {
              entityId: sponsor.id,
              change: 20
            }
          ]
        }
      },
      {
        id: uuidv4(),
        text: 'דחה את ההצעה',
        effects: {
          relationships: [
            {
              entityId: sponsor.id,
              change: -10
            }
          ]
        }
      }
    ],
    isHandled: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // שבוע מהיום
  };
};

const generateMediaEvent = (): OfficeEvent => {
  const mediaOutlet = MEDIA_OUTLETS[Math.floor(Math.random() * MEDIA_OUTLETS.length)];
  const isPositive = Math.random() > 0.3;
  
  return {
    id: uuidv4(),
    type: 'MEDIA_COVERAGE',
    title: `כיסוי תקשורתי ב${mediaOutlet}`,
    description: isPositive ?
      `${mediaOutlet} מעוניינים לפרסם כתבה חיובית על המשרד שלך ופעילותו בשוק ההעברות` :
      `${mediaOutlet} מתכננים לפרסם כתבה ביקורתית על שיטות העבודה של המשרד שלך`,
    date: new Date().toISOString(),
    options: isPositive ? [
      {
        id: uuidv4(),
        text: 'שתף פעולה עם הכתבה',
        effects: {
          reputation: 10,
          experience: 100
        }
      },
      {
        id: uuidv4(),
        text: 'התעלם מהבקשה',
        effects: {
          reputation: -5
        }
      }
    ] : [
      {
        id: uuidv4(),
        text: 'נסה למנוע את הפרסום',
        effects: {
          treasury: -10000,
          reputation: -5
        }
      },
      {
        id: uuidv4(),
        text: 'התמודד עם הביקורת בכבוד',
        effects: {
          reputation: -10,
          experience: 50
        }
      }
    ],
    isHandled: false,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 ימים
  };
};

const generateStaffEvent = (currentLevel: OfficeLevel): OfficeEvent => {
  const eventTypes = [
    'דרישה להעלאת שכר',
    'סכסוך בין עובדים',
    'הצעת עבודה מתחרה',
    'בקשה לקידום'
  ];
  
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const staffCost = Math.floor(currentLevel.monthlyExpenses * 0.2);
  
  return {
    id: uuidv4(),
    type: 'STAFF_ISSUE',
    title: `בעיה בצוות: ${eventType}`,
    description: `אחד מאנשי הצוות שלך ${
      eventType === 'דרישה להעלאת שכר' ? 'דורש העלאה בשכר' :
      eventType === 'סכסוך בין עובדים' ? 'מדווח על סכסוך עם עובד אחר' :
      eventType === 'הצעת עבודה מתחרה' ? 'קיבל הצעת עבודה ממשרד מתחרה' :
      'מבקש קידום בתפקיד'
    }`,
    date: new Date().toISOString(),
    options: [
      {
        id: uuidv4(),
        text: eventType === 'דרישה להעלאת שכר' ? 'אשר את ההעלאה' :
             eventType === 'סכסוך בין עובדים' ? 'נסה לפתור את הסכסוך' :
             eventType === 'הצעת עבודה מתחרה' ? 'הצע העלאה בשכר' :
             'אשר את הקידום',
        effects: {
          treasury: -staffCost,
          experience: 50,
          relationships: [
            {
              entityId: 'staff',
              change: 10
            }
          ]
        }
      },
      {
        id: uuidv4(),
        text: 'דחה את הבקשה',
        effects: {
          relationships: [
            {
              entityId: 'staff',
              change: -20
            }
          ]
        }
      }
    ],
    isHandled: false,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 ימים
  };
};

const generateSpecialOpportunity = (currentLevel: OfficeLevel): OfficeEvent => {
  const opportunities = [
    {
      title: 'הזדמנות להרחבת המשרד',
      description: 'התפנה משרד גדול יותר באזור מרכזי',
      cost: currentLevel.monthlyExpenses * 3,
      benefit: 'reputationBonus'
    },
    {
      title: 'הצעה לשיתוף פעולה',
      description: 'משרד סוכנים מוביל מציע שיתוף פעולה',
      cost: currentLevel.monthlyExpenses * 2,
      benefit: 'negotiationBonus'
    },
    {
      title: 'השקעה בטכנולוגיה',
      description: 'אפשרות לרכוש מערכת סקאוטינג מתקדמת',
      cost: currentLevel.monthlyExpenses * 4,
      benefit: 'scoutingSpeedBonus'
    }
  ];
  
  const opportunity = opportunities[Math.floor(Math.random() * opportunities.length)];
  
  return {
    id: uuidv4(),
    type: 'SPECIAL_OPPORTUNITY',
    title: opportunity.title,
    description: opportunity.description,
    date: new Date().toISOString(),
    options: [
      {
        id: uuidv4(),
        text: 'נצל את ההזדמנות',
        effects: {
          treasury: -opportunity.cost,
          experience: 200,
          [opportunity.benefit]: 15
        }
      },
      {
        id: uuidv4(),
        text: 'דחה את ההצעה',
        effects: {
          experience: -50
        }
      }
    ],
    isHandled: false,
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 ימים
  };
};

export const generateRandomEvent = (): void => {
  const state = store.getState();
  const { currentLevel } = state.office;
  const currentOffice = OFFICE_LEVELS[currentLevel - 1];
  
  const eventTypes: OfficeEventType[] = [
    'SPONSOR_OFFER',
    'MEDIA_COVERAGE',
    'STAFF_ISSUE',
    'SPECIAL_OPPORTUNITY'
  ];
  
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  let event: OfficeEvent;
  
  switch (randomType) {
    case 'SPONSOR_OFFER':
      event = generateSponsorOffer(currentLevel);
      break;
    case 'MEDIA_COVERAGE':
      event = generateMediaEvent();
      break;
    case 'STAFF_ISSUE':
      event = generateStaffEvent(currentOffice);
      break;
    case 'SPECIAL_OPPORTUNITY':
      event = generateSpecialOpportunity(currentOffice);
      break;
    default:
      event = generateMediaEvent(); // ברירת מחדל
  }
  
  store.dispatch(addEvent(event));
};

export const startEventGenerator = (): void => {
  // יצירת אירוע חדש כל 3-7 ימים (במונחי זמן משחק)
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% סיכוי לאירוע בכל בדיקה
      generateRandomEvent();
    }
  }, 1000 * 60 * 60 * 24 * (3 + Math.floor(Math.random() * 5))); // 3-7 ימים
}; 