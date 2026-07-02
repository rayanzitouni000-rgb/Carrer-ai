import { getMockJobById } from '@/data/mockJobOffers';
import { resolveJobOffer } from '@/services/jobOfferStore';

export function normalizeRouteId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value?.trim() ?? '';
}

export function getJobOfferById(id: string) {
  return resolveJobOffer(id, getMockJobById);
}
