import { addWeeks, isAfter, isBefore, startOfDay } from 'date-fns';
import { CollectionSchedule, GarbageType, CollectionDay, WeeklyCollection } from '../types';
import { getWeekDates } from './dateUtils';

export const getCollectionsForDate = (
  date: Date,
  schedules: CollectionSchedule[],
  garbageTypes: GarbageType[]
): GarbageType[] => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDate = startOfDay(date);
  
  const collections: GarbageType[] = [];
  
  schedules.forEach(schedule => {
    if (!schedule.is_active || schedule.day_of_week !== dayOfWeek) {
      return;
    }
    
    // Check if date is within schedule range
    const startDate = startOfDay(new Date(schedule.start_date));
    if (isBefore(targetDate, startDate)) {
      return;
    }
    
    if (schedule.end_date) {
      const endDate = startOfDay(new Date(schedule.end_date));
      if (isAfter(targetDate, endDate)) {
        return;
      }
    }
    
    // Check week interval
    const weeksSinceStart = Math.floor(
      (targetDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    
    if (weeksSinceStart % schedule.week_interval === 0) {
      const garbageType = garbageTypes.find(gt => gt.id === schedule.garbage_type_id);
      if (garbageType) {
        collections.push(garbageType);
      }
    }
  });
  
  return collections;
};

export const getWeeklyCollections = (
  weekStart: Date,
  schedules: CollectionSchedule[],
  garbageTypes: GarbageType[]
): WeeklyCollection => {
  const weekDates = getWeekDates(weekStart);
  
  const collections: CollectionDay[] = weekDates.map(date => ({
    date,
    garbageTypes: getCollectionsForDate(date, schedules, garbageTypes)
  }));
  
  return {
    week: weekDates,
    collections
  };
};

export const getNextCollectionDates = (
  schedules: CollectionSchedule[],
  garbageTypes: GarbageType[]
): { garbageType: GarbageType; nextDate: Date }[] => {
  const today = new Date();
  const nextCollections: { garbageType: GarbageType; nextDate: Date }[] = [];
  
  // Get unique garbage types from schedules
  const uniqueGarbageTypes = new Map<string, GarbageType>();
  schedules.forEach(schedule => {
    const garbageType = garbageTypes.find(gt => gt.id === schedule.garbage_type_id);
    if (garbageType && !uniqueGarbageTypes.has(garbageType.id)) {
      uniqueGarbageTypes.set(garbageType.id, garbageType);
    }
  });
  
  uniqueGarbageTypes.forEach(garbageType => {
    const typeSchedules = schedules.filter(s => s.garbage_type_id === garbageType.id && s.is_active);
    
    if (typeSchedules.length > 0) {
      // Find the next collection date for this garbage type
      let nextDate: Date | null = null;
      
      typeSchedules.forEach(schedule => {
        const candidateDate = getNextCollectionDateForSchedule(today, schedule);
        if (!nextDate || candidateDate < nextDate) {
          nextDate = candidateDate;
        }
      });
      
      if (nextDate) {
        nextCollections.push({ garbageType, nextDate });
      }
    }
  });
  
  return nextCollections.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
};

const getNextCollectionDateForSchedule = (fromDate: Date, schedule: CollectionSchedule): Date => {
  const dayOfWeek = schedule.day_of_week;
  const weekInterval = schedule.week_interval;
  
  // Calculate the next collection date
  const daysUntilNextDay = (dayOfWeek - fromDate.getDay() + 7) % 7;
  let nextDate = new Date(fromDate);
  nextDate.setDate(fromDate.getDate() + daysUntilNextDay);
  
  // If the calculated date is today or in the past, move to next interval
  if (nextDate <= fromDate) {
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + (weekInterval * 7));
  }
  
  return nextDate;
};

