export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('he-IL').format(num);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} דקות`;
  } else if (remainingMinutes === 0) {
    return `${hours} שעות`;
  } else {
    return `${hours} שעות ו-${remainingMinutes} דקות`;
  }
};

export const formatShortDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('he-IL', {
    month: 'numeric',
    day: 'numeric'
  }).format(d);
};

export const formatWeekNumber = (date: string | Date): string => {
  const d = new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  return `שבוע ${weekNumber}`;
}; 