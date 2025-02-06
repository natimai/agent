export const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateName = (): string => {
  const firstNames = ['אדם', 'דניאל', 'יוסי', 'עידן', 'רון', 'גיא', 'אור'];
  const lastNames = ['כהן', 'לוי', 'פרץ', 'אברהם', 'דוד', 'מלכה'];
  
  return `${randomFromArray(firstNames)} ${randomFromArray(lastNames)}`;
}; 