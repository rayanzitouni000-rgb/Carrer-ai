import type { JobOffer } from '@/types/jobMatch';

const cache = new Map<string, JobOffer>();

export const jobOfferStore = {
  get(id: string): JobOffer | undefined {
    return cache.get(id);
  },

  set(offer: JobOffer): void {
    if (offer.id) cache.set(offer.id, offer);
  },

  setMany(offers: JobOffer[]): void {
    for (const offer of offers) {
      if (offer.id) cache.set(offer.id, offer);
    }
  },

  clear(): void {
    cache.clear();
  },
};

/** Cache API en priorité, fallback mock catalogue local. */
export function resolveJobOffer(
  id: string,
  mockLookup: (id: string) => JobOffer | undefined
): JobOffer | undefined {
  return jobOfferStore.get(id) ?? mockLookup(id);
}
