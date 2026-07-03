import type { JobOffer } from '@/types/jobMatch';

export type JobOfferSource = 'france_travail' | 'adzuna' | 'mock';

export interface JobSearchSourceCounts {
  franceTravail: number;
  adzuna: number;
}

export function getJobOfferSource(id: string): JobOfferSource {
  if (id.startsWith('adzuna-')) return 'adzuna';
  if (id.startsWith('job-')) return 'mock';
  return 'france_travail';
}

export function getJobOfferSourceLabel(source: JobOfferSource): string {
  if (source === 'adzuna') return 'Adzuna';
  if (source === 'mock') return 'Mock';
  return 'France Travail';
}

export function countOfferSources(offers: JobOffer[]): JobSearchSourceCounts {
  return offers.reduce(
    (acc, offer) => {
      if (getJobOfferSource(offer.id) === 'adzuna') acc.adzuna += 1;
      else acc.franceTravail += 1;
      return acc;
    },
    { franceTravail: 0, adzuna: 0 }
  );
}

export function formatSourceSummary(counts: JobSearchSourceCounts | null): string {
  if (!counts) return '';
  const parts: string[] = [];
  if (counts.franceTravail > 0) parts.push('France Travail');
  if (counts.adzuna > 0) parts.push('Adzuna');
  return parts.length > 0 ? ` · ${parts.join(' + ')}` : '';
}
