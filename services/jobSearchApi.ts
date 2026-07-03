import { getJobApiBaseUrl } from '@/constants/apiConfig';
import type { JobSearchFilters } from '@/types/jobMatch';
import type { JobOffer } from '@/types/jobMatch';
import type { JobSearchSourceCounts } from '@/utils/jobOfferSource';

export interface FetchJobOffersParams {
  query: string;
  location: string;
  contractTypes: string[];
  remoteOnly: boolean;
}

export interface FetchJobOffersResult {
  offers: JobOffer[];
  sources: JobSearchSourceCounts | null;
}

function buildSearchUrl(params: FetchJobOffersParams): string {
  const base = getJobApiBaseUrl();
  if (!base) throw new Error('Job API URL not configured');

  const url = new URL('/api/job-search', base.replace(/\/$/, ''));
  if (params.query.trim()) url.searchParams.set('query', params.query.trim());
  if (params.location.trim()) url.searchParams.set('location', params.location.trim());
  if (params.contractTypes.length > 0) {
    url.searchParams.set('contractTypes', params.contractTypes.join(','));
  }
  if (params.remoteOnly) url.searchParams.set('remoteOnly', 'true');
  return url.toString();
}

export async function fetchJobOffersFromApi(
  params: FetchJobOffersParams
): Promise<FetchJobOffersResult> {
  const response = await fetch(buildSearchUrl(params));
  if (!response.ok) {
    throw new Error(`Job API error: ${response.status}`);
  }
  const data = (await response.json()) as {
    offers?: JobOffer[];
    sources?: JobSearchSourceCounts;
  };
  return {
    offers: data.offers ?? [],
    sources: data.sources ?? null,
  };
}

export async function fetchJobOfferById(id: string): Promise<JobOffer | null> {
  const base = getJobApiBaseUrl();
  if (!base || !id.trim()) return null;

  const url = `${base.replace(/\/$/, '')}/api/job-offer/${encodeURIComponent(id.trim())}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = (await response.json()) as { offer?: JobOffer };
  return data.offer ?? null;
}

export function filtersToFetchParams(filters: JobSearchFilters): FetchJobOffersParams {
  return {
    query: filters.query,
    location: filters.location,
    contractTypes: filters.contractTypes,
    remoteOnly: filters.remoteOnly,
  };
}
