import type { CareerProfile } from '@/features/career-onboarding/types';
import type { JobSearchFilters, JobSearchPreferences } from '@/types/jobMatch';

export function buildDefaultJobSearchFilters(
  profile: CareerProfile,
  preferences: JobSearchPreferences
): JobSearchFilters {
  return {
    query: profile.targetRoles[0] ?? '',
    location: preferences.location,
    radius: preferences.radius,
    contractTypes: [],
    remoteOnly: false,
    minSalary: undefined,
    datePosted: 'all',
  };
}

export function formatLastSearchLabel(timestamp: number | null): string | null {
  if (timestamp === null) return null;
  const diffMs = Date.now() - timestamp;
  if (diffMs < 60_000) return "Dernière recherche : à l'instant";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `Dernière recherche : il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `Dernière recherche : il y a ${hours} h`;
}
