import { useCallback, useState } from 'react';

import { getJobOfferById } from '@/utils/jobOfferResolver';
import { careerProfileStore } from '@/services/careerProfileStore';
import { coverLetterStore } from '@/services/coverLetterStore';
import type { CoverLetterData } from '@/types/coverLetter';
import { EMPTY_COVER_LETTER } from '@/types/coverLetter';

function buildInitialFromProfile(): CoverLetterData {
  const profile = careerProfileStore.get();
  return {
    ...EMPTY_COVER_LETTER,
    fullName: profile.firstName.trim() || 'Utilisateur',
  };
}

export interface UseCoverLetterGeneratorReturn {
  data: CoverLetterData;
  updateField: (field: keyof CoverLetterData, value: string) => void;
  loadFromJobOffer: (jobOfferId: string) => void;
  resetDraft: () => void;
  syncFromStore: () => void;
}

export function useCoverLetterGenerator(): UseCoverLetterGeneratorReturn {
  const [data, setData] = useState<CoverLetterData>(() => {
    const stored = coverLetterStore.get();
    return stored ?? buildInitialFromProfile();
  });

  const commit = useCallback((updater: (current: CoverLetterData) => CoverLetterData) => {
    setData((current) => {
      const next = updater(current);
      coverLetterStore.set(next);
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    const initial = buildInitialFromProfile();
    coverLetterStore.set(initial);
    setData(initial);
  }, []);

  const syncFromStore = useCallback(() => {
    setData(coverLetterStore.getOrEmpty());
  }, []);

  const updateField = useCallback(
    (field: keyof CoverLetterData, value: string) => {
      commit((current) => ({ ...current, [field]: value }));
    },
    [commit]
  );

  const loadFromJobOffer = useCallback(
    (jobOfferId: string) => {
      const offer = getJobOfferById(jobOfferId);
      if (!offer) return;

      commit((current) => ({
        ...current,
        jobOfferId,
        jobTitle: offer.title,
        company: offer.company,
        fullName: buildInitialFromProfile().fullName,
      }));
    },
    [commit]
  );

  return {
    data,
    updateField,
    loadFromJobOffer,
    resetDraft,
    syncFromStore,
  };
}
