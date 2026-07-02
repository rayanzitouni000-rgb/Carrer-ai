import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { MOCK_JOB_OFFERS } from '@/data/mockJobOffers';
import type { CareerProfile } from '@/features/career-onboarding/types';
import { careerProfileStore } from '@/services/careerProfileStore';
import {
  DEFAULT_JOB_SEARCH_FILTERS,
  type JobOffer,
  type JobSearchFilters,
} from '@/types/jobMatch';
import { enrichOffersWithMatchScore } from '@/utils/matchScoreCalculator';

export interface UseJobSearchReturn {
  filters: JobSearchFilters;
  setFilters: (partial: Partial<JobSearchFilters>) => void;
  resetFilters: () => void;
  results: JobOffer[];
  isLoading: boolean;
}

const JobSearchContext = createContext<UseJobSearchReturn | null>(null);

function matchesDatePosted(publishedDate: string, datePosted: JobSearchFilters['datePosted']): boolean {
  if (datePosted === 'all') return true;
  const published = new Date(publishedDate).getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  if (datePosted === 'today') return now - published <= dayMs;
  if (datePosted === 'week') return now - published <= 7 * dayMs;
  if (datePosted === 'month') return now - published <= 30 * dayMs;
  return true;
}

function filterOffers(offers: JobOffer[], filters: JobSearchFilters): JobOffer[] {
  const query = filters.query.trim().toLowerCase();

  return offers.filter((offer) => {
    if (query) {
      const haystack = `${offer.title} ${offer.company}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.contractTypes.length > 0 && !filters.contractTypes.includes(offer.contractType)) {
      return false;
    }

    if (filters.remoteOnly && !offer.isRemote) return false;

    if (filters.location.trim()) {
      const locationQuery = filters.location.trim().toLowerCase();
      // TODO: remplacer par géolocalisation / rayon réel avec l'API France Travail
      if (!offer.location.toLowerCase().includes(locationQuery)) return false;
    }

    if (filters.minSalary !== undefined && filters.minSalary > 0) {
      const offerMax = offer.salaryMax ?? offer.salaryMin ?? 0;
      if (offerMax < filters.minSalary) return false;
    }

    if (!matchesDatePosted(offer.publishedDate, filters.datePosted)) return false;

    return true;
  });
}

function JobSearchProviderInner({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<JobSearchFilters>(DEFAULT_JOB_SEARCH_FILTERS);
  const [profile, setProfile] = useState<CareerProfile>(careerProfileStore.get());
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    void careerProfileStore.hydrate().then(setProfile);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const setFilters = useCallback((partial: Partial<JobSearchFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_JOB_SEARCH_FILTERS);
  }, []);

  const results = useMemo(() => {
    // TODO: remplacer MOCK_JOB_OFFERS par fetch API France Travail
    const scored = enrichOffersWithMatchScore(profile, MOCK_JOB_OFFERS);
    const filtered = filterOffers(scored, debouncedFilters);
    return filtered.sort((a, b) => b.matchScore - a.matchScore);
  }, [profile, debouncedFilters]);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters, results, isLoading }),
    [filters, setFilters, resetFilters, results, isLoading]
  );

  return <JobSearchContext.Provider value={value}>{children}</JobSearchContext.Provider>;
}

export function JobSearchProvider({ children }: { children: ReactNode }) {
  return <JobSearchProviderInner>{children}</JobSearchProviderInner>;
}

export function useJobSearch(): UseJobSearchReturn {
  const context = useContext(JobSearchContext);
  if (!context) {
    throw new Error('useJobSearch must be used within JobSearchProvider');
  }
  return context;
}
