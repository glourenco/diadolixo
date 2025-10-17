import { format, startOfWeek, endOfWeek, addDays, isSameDay, getDay } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

export const getLocale = (language: string) => {
  switch (language) {
    case 'pt':
      return ptBR;
    case 'en':
      return enUS;
    case 'es':
      return es;
    default:
      return ptBR;
  }
};

export const formatDate = (date: Date, language: string = 'pt') => {
  const locale = getLocale(language);
  return format(date, 'dd/MM/yyyy', { locale });
};

export const formatWeekDay = (date: Date, language: string = 'pt') => {
  const locale = getLocale(language);
  return format(date, 'EEEE', { locale });
};

export const formatWeekDayShort = (date: Date, language: string = 'pt') => {
  const locale = getLocale(language);
  return format(date, 'EEE', { locale });
};

export const getWeekDates = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // End week on Sunday
  
  const weekDates = [];
  let current = start;
  
  while (current <= end) {
    weekDates.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return weekDates;
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const getDayOfWeek = (date: Date) => {
  return getDay(date); // 0 = Sunday, 1 = Monday, etc.
};

export const getNextCollectionDate = (dayOfWeek: number, weekInterval: number = 1) => {
  const today = new Date();
  const currentDay = getDayOfWeek(today);
  
  // Calculate days until next collection
  let daysUntilCollection = (dayOfWeek - currentDay + 7) % 7;
  
  // If it's the same day, check if it's for next week
  if (daysUntilCollection === 0) {
    daysUntilCollection = 7 * weekInterval;
  }
  
  return addDays(today, daysUntilCollection);
};

