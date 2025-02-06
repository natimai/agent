const firstNames = [
  'אבי', 'יוסי', 'משה', 'דוד', 'יעקב', 'דניאל', 'איתי', 'עידן', 'אלון', 'גיא',
  'רון', 'אסף', 'עומר', 'ניר', 'תום', 'יובל', 'נדב', 'אורי', 'רועי', 'עמית'
];

const lastNames = [
  'כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'אברהם', 'פרידמן', 'שפירא', 'אזולאי',
  'אוחיון', 'גבאי', 'מלכה', 'חדד', 'יוסף', 'סויסה', 'וקנין', 'טל', 'שלום', 'אדרי'
];

export const generateRandomName = (): string => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export const generateNameByCountry = (countryCode: string): string => {
  // בהמשך נוסיף תמיכה בשמות לפי מדינות
  return generateRandomName();
}; 