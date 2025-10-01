import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, addYears, differenceInCalendarDays, getDay } from "date-fns";

export interface AgeStats {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  dayOfWeek: string;
  nextBirthdayDays: number;
  nextMilestone: { age: number; days: number } | null;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MILESTONES = [18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100];

export const calculateAge = (birthDate: Date): AgeStats => {
  const now = new Date();

  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;
  const totalDays = differenceInDays(now, birthDate);
  
  // For days in current year
  const lastBirthday = addYears(birthDate, years);
  const days = differenceInDays(now, lastBirthday);
  
  const hours = differenceInHours(now, birthDate);
  const minutes = differenceInMinutes(now, birthDate);
  const seconds = differenceInSeconds(now, birthDate);

  // Day of week born
  const dayOfWeek = DAYS_OF_WEEK[getDay(birthDate)];

  // Next birthday countdown
  const nextBirthday = addYears(birthDate, years + 1);
  const nextBirthdayDays = differenceInCalendarDays(nextBirthday, now);

  // Next milestone
  const nextMilestone = MILESTONES.find(m => m > years);
  const nextMilestoneData = nextMilestone
    ? {
        age: nextMilestone,
        days: differenceInCalendarDays(addYears(birthDate, nextMilestone), now),
      }
    : null;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    dayOfWeek,
    nextBirthdayDays,
    nextMilestone: nextMilestoneData,
  };
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
