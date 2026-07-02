import { getMockJobById } from '@/data/mockJobOffers';
import { resolveJobOffer } from '@/services/jobOfferStore';

export function getJobOfferById(id: string) {
  return resolveJobOffer(id, getMockJobById);
}
