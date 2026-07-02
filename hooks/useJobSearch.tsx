import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isJobApiConfigured } from '@/constants/apiConfig';
import { MOCK_JOB_OFFERS } from '@/data/mockJobOffers';
import type { CareerProfile } from '@/features/career-onboarding/types';
import { useJobSearchPreferences } from '@/hooks/useJobSearchPreferences';
import { filtersToFetchParams, fetchJobOffersFromApi } from '@/services/jobSearchApi';
import { jobOfferStore } from '@/services/jobOfferStore';
import { careerProfileStore } from '@/services/careerProfileStore';
import {
  DEFAULT_JOB_SEARCH_FILTERS,
  type JobOffer,
  type JobSearchFilters,
} from '@/types/jobMatch';
import { buildDefaultJobSearchFilters } from '@/utils/jobSearchDefaults';
import { enrichOffersWithMatchScore } from '@/utils/matchScoreCalculator';

export interface UseJobSearchReturn {
  filters: JobSearchFilters;
  setFilters: (partial: Partial<JobSearchFilters>) => void;
  resetFilters: () => void;
  results: JobOffer[];
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => void;
  lastSearchAt: number | null;
  usesLiveApi: boolean;
  apiError: string | null;
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

function filterOffers(
  offers: JobOffer[],
  filters: JobSearchFilters,
  fromLiveApi: boolean
): JobOffer[] {
  const query = filters.query.trim().toLowerCase();

  return offers.filter((offer) => {
    if (!fromLiveApi) {
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
        if (!offer.location.toLowerCase().includes(locationQuery)) return false;
      }
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
  const { preferences, isReady: preferencesReady } = useJobSearchPreferences();
  const [filters, setFiltersState] = useState<JobSearchFilters>(DEFAULT_JOB_SEARCH_FILTERS);
  const [profile, setProfile] = useState<CareerProfile>(careerProfileStore.get());
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [apiOffers, setApiOffers] = useState<JobOffer[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastSearchAt, setLastSearchAt] = useState<number | null>(null);
  const usesLiveApi = isJobApiConfigured();

  const userModifiedRef = useRef(false);
  const sessionInitializedRef = useRef(false);
  const fetchGenerationRef = useRef(0);

  useEffect(() => {
    void careerProfileStore.hydrate().then(setProfile);
  }, []);

  useEffect(() => {
    if (!preferencesReady || !profile || sessionInitializedRef.current) return;
    if (!preferences.hasBeenSet) return;

    sessionInitializedRef.current = true;
    if (!userModifiedRef.current) {
      setFiltersState(buildDefaultJobSearchFilters(profile, preferences));
    }
  }, [preferencesReady, preferences, profile]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const runSearch = useCallback(
    async (activeFilters: JobSearchFilters, mode: 'initial' | 'refresh' = 'initial') => {
      if (!usesLiveApi) {
        setApiOffers(null);
        setApiError(null);
        setLastSearchAt(Date.now());
        return;
      }

      const generation = ++fetchGenerationRef.current;
      if (mode === 'refresh') setIsRefreshing(true);
      else setIsLoading(true);
      setApiError(null);

      try {
        const offers = await fetchJobOffersFromApi(filtersToFetchParams(activeFilters));
        if (generation !== fetchGenerationRef.current) return;
        jobOfferStore.setMany(offers);
        setApiOffers(offers);
        setLastSearchAt(Date.now());
      } catch (error: unknown) {
        if (generation !== fetchGenerationRef.current) return;
        console.warn('Job API fetch failed, fallback mock:', error);
        setApiOffers(null);
        setApiError('Impossible de joindre le backend — données mock affichées.');
        setLastSearchAt(Date.now());
      } finally {
        if (generation !== fetchGenerationRef.current) return;
        if (mode === 'refresh') setIsRefreshing(false);
        else setIsLoading(false);
      }
    },
    [usesLiveApi]
  );

  useEffect(() => {
    if (!preferencesReady || !preferences.hasBeenSet) return;
    void runSearch(debouncedFilters, 'initial');
  }, [debouncedFilters, preferencesReady, preferences.hasBeenSet, runSearch]);

  const setFilters = useCallback((partial: Partial<JobSearchFilters>) => {
    userModifiedRef.current = true;
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    userModifiedRef.current = false;
    setFiltersState(buildDefaultJobSearchFilters(profile, preferences));
  }, [profile, preferences]);

  const refresh = useCallback(() => {
    void runSearch(debouncedFilters, 'refresh');
  }, [debouncedFilters, runSearch]);

  const results = useMemo(() => {
    const source = apiOffers ?? MOCK_JOB_OFFERS;
    const scored = enrichOffersWithMatchScore(profile, source);
    const filtered = filterOffers(scored, debouncedFilters, apiOffers !== null);
    return filtered.sort((a, b) => b.matchScore - a.matchScore);
  }, [profile, debouncedFilters, apiOffers]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      results,
      isLoading,
      isRefreshing,
      refresh,
      lastSearchAt,
      usesLiveApi,
      apiError,
    }),
    [
      filters,
      setFilters,
      resetFilters,
      results,
      isLoading,
      isRefreshing,
      refresh,
      lastSearchAt,
      usesLiveApi,
      apiError,
    ]
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
