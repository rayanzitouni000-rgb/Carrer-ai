import { useEffect, useState } from 'react';

import { isJobApiConfigured } from '@/constants/apiConfig';
import { fetchJobOfferById } from '@/services/jobSearchApi';
import { jobOfferStore } from '@/services/jobOfferStore';
import type { JobOffer } from '@/types/jobMatch';
import { getJobOfferById } from '@/utils/jobOfferResolver';

export function useJobOffer(offerId: string) {
  const [offer, setOffer] = useState<JobOffer | undefined>(() =>
    offerId ? getJobOfferById(offerId) : undefined
  );
  const [isLoading, setIsLoading] = useState(Boolean(offerId) && !offer);

  useEffect(() => {
    if (!offerId) {
      setOffer(undefined);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const cached = getJobOfferById(offerId);
    if (cached) {
      setOffer(cached);
      setIsLoading(false);
      return;
    }

    if (!isJobApiConfigured()) {
      setOffer(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void fetchJobOfferById(offerId)
      .then((fetched) => {
        if (cancelled) return;
        if (fetched) {
          jobOfferStore.set(fetched);
          setOffer(fetched);
        } else {
          setOffer(undefined);
        }
      })
      .catch(() => {
        if (!cancelled) setOffer(undefined);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [offerId]);

  return { offer, isLoading };
}
