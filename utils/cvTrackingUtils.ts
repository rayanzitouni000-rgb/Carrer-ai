import type { CvSentEntry } from '@/types/cvTracking';

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Lundi comme premier jour de semaine (locale FR). */
function startOfWeek(): Date {
  const start = startOfToday();
  const day = start.getDay(); // 0 = dimanche
  const diff = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - diff);
  return start;
}

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function isAfterOrEqual(entry: CvSentEntry, threshold: Date): boolean {
  const entryDate = new Date(entry.date);
  if (Number.isNaN(entryDate.getTime())) return false;
  return entryDate.getTime() >= threshold.getTime();
}

export function getEntriesForToday(entries: CvSentEntry[]): CvSentEntry[] {
  const threshold = startOfToday();
  return entries.filter((entry) => isAfterOrEqual(entry, threshold));
}

export function getEntriesForThisWeek(entries: CvSentEntry[]): CvSentEntry[] {
  const threshold = startOfWeek();
  return entries.filter((entry) => isAfterOrEqual(entry, threshold));
}

export function getEntriesForThisMonth(entries: CvSentEntry[]): CvSentEntry[] {
  const threshold = startOfMonth();
  return entries.filter((entry) => isAfterOrEqual(entry, threshold));
}

export function getCountByPeriod(
  entries: CvSentEntry[],
  period: 'day' | 'week' | 'month'
): number {
  switch (period) {
    case 'day':
      return getEntriesForToday(entries).length;
    case 'week':
      return getEntriesForThisWeek(entries).length;
    case 'month':
      return getEntriesForThisMonth(entries).length;
    default:
      return 0;
  }
}
