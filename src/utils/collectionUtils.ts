import { addWeeks, isAfter, isBefore, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CollectionSchedule, GarbageType, CollectionDay, WeeklyCollection } from '../types';
import { getWeekDates } from './dateUtils';

export const getCollectionsForDate = (
  date: Date,
  schedules: CollectionSchedule[],
  garbageTypes: GarbageType[]
): GarbageType[] => {
  // Use local timezone for day calculation
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDate = startOfDay(date);
  
  const collections: GarbageType[] = [];
  
  console.log(`Checking collections for ${date.toDateString()} (day ${dayOfWeek})`);
  
  schedules.forEach(schedule => {
    console.log(`Schedule: day_of_week=${schedule.day_of_week}, week_interval=${schedule.week_interval}, active=${schedule.is_active}`);
    
    if (!schedule.is_active || schedule.day_of_week !== dayOfWeek) {
      return;
    }
    
    // Parse dates in local timezone to avoid UTC issues
    const startDateParts = schedule.start_date.split('-');
    const startDate = new Date(parseInt(startDateParts[0]), parseInt(startDateParts[1]) - 1, parseInt(startDateParts[2]));
    const targetDateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Check if date is within schedule range
    if (isBefore(targetDateLocal, startDate)) {
      console.log(`Date ${targetDateLocal.toDateString()} is before start date ${startDate.toDateString()}`);
      return;
    }
    
    if (schedule.end_date) {
      const endDateParts = schedule.end_date.split('-');
      const endDate = new Date(parseInt(endDateParts[0]), parseInt(endDateParts[1]) - 1, parseInt(endDateParts[2]));
      if (isAfter(targetDateLocal, endDate)) {
        console.log(`Date ${targetDateLocal.toDateString()} is after end date ${endDate.toDateString()}`);
        return;
      }
    }
    
    // For week_interval = 2, we need to check if we're on the right alternating week
    if (schedule.week_interval === 2) {
      // Use a more reliable week calculation using ISO weeks
      const getISOWeek = (date: Date) => {
        const tempDate = new Date(date.getTime());
        const dayNum = (date.getDay() + 6) % 7;
        tempDate.setDate(tempDate.getDate() - dayNum + 3);
        const firstThursday = tempDate.valueOf();
        tempDate.setMonth(0, 1);
        if (tempDate.getDay() !== 4) {
          tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000);
      };
      
      const startWeek = getISOWeek(startDate);
      const targetWeek = getISOWeek(targetDateLocal);
      const weeksSinceStart = targetWeek - startWeek;
      
      console.log(`Start week: ${startWeek}, Target week: ${targetWeek}, Weeks since start: ${weeksSinceStart}, week_interval: ${schedule.week_interval}, start: ${startDate.toDateString()}, target: ${targetDateLocal.toDateString()}`);
      
      // For alternating weeks, check if we're on the right week
      if (weeksSinceStart % 2 === 0) {
        const garbageType = garbageTypes.find(gt => gt.id === schedule.garbage_type_id);
        if (garbageType) {
          console.log(`Adding ${garbageType.name_pt} for alternating week (week ${weeksSinceStart})`);
          collections.push(garbageType);
        }
      }
    } else {
      // For weekly collections, check if we're on the right week interval
      const weeksSinceStart = Math.floor(
        (targetDateLocal.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      
      console.log(`Weeks since start: ${weeksSinceStart}, week_interval: ${schedule.week_interval}`);
      
      if (weeksSinceStart % schedule.week_interval === 0) {
        const garbageType = garbageTypes.find(gt => gt.id === schedule.garbage_type_id);
        if (garbageType) {
          console.log(`Adding ${garbageType.name_pt} for weekly collection`);
          collections.push(garbageType);
        }
      }
    }
  });
  
  console.log(`Found ${collections.length} collections for ${date.toDateString()}`);
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

export const getMonthlyCollections = (
  monthStart: Date,
  schedules: CollectionSchedule[],
  garbageTypes: GarbageType[]
): WeeklyCollection => {
  const monthStartDate = startOfMonth(monthStart);
  const monthEndDate = endOfMonth(monthStart);
  const monthDates = eachDayOfInterval({ start: monthStartDate, end: monthEndDate });
  
  const collections: CollectionDay[] = monthDates.map(date => ({
    date,
    garbageTypes: getCollectionsForDate(date, schedules, garbageTypes)
  }));
  
  return {
    week: monthDates,
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

