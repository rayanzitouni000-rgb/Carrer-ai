import { useCallback, useState } from 'react';

import {
  CLOSING_OPTIONS,
  INTRO_OPTIONS,
  MOTIVATION_OPTIONS,
  fillTemplate,
} from '@/data/coverLetterTemplates';
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

function getTemplateVars(data: CoverLetterData): Record<string, string> {
  const profile = careerProfileStore.get();
  const mainExperience =
    profile.experiences.find((exp) => exp.jobTitle.trim())?.jobTitle.trim() ??
    profile.targetRoles[0]?.trim() ??
    '';

  return {
    firstName: profile.firstName.trim() || data.fullName.split(' ')[0] || '',
    jobTitle: data.jobTitle.trim(),
    company: data.company.trim(),
    mainExperience,
  };
}

export interface UseCoverLetterGeneratorReturn {
  data: CoverLetterData;
  selectedIntroId: string | null;
  selectedMotivationId: string | null;
  selectedClosingId: string | null;
  setIntroOption: (optionId: string) => void;
  setMotivationOption: (optionId: string) => void;
  setClosingOption: (optionId: string) => void;
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
  const [selectedIntroId, setSelectedIntroId] = useState<string | null>(null);
  const [selectedMotivationId, setSelectedMotivationId] = useState<string | null>(null);
  const [selectedClosingId, setSelectedClosingId] = useState<string | null>(null);

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
    setSelectedIntroId(null);
    setSelectedMotivationId(null);
    setSelectedClosingId(null);
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

  const setIntroOption = useCallback(
    (optionId: string) => {
      const option = INTRO_OPTIONS.find((item) => item.id === optionId);
      if (!option) return;
      setSelectedIntroId(optionId);
      commit((current) => ({
        ...current,
        introText: fillTemplate(option.template, getTemplateVars(current)),
      }));
    },
    [commit]
  );

  const setMotivationOption = useCallback(
    (optionId: string) => {
      const option = MOTIVATION_OPTIONS.find((item) => item.id === optionId);
      if (!option) return;
      setSelectedMotivationId(optionId);
      commit((current) => ({
        ...current,
        motivationText: fillTemplate(option.template, getTemplateVars(current)),
      }));
    },
    [commit]
  );

  const setClosingOption = useCallback(
    (optionId: string) => {
      const option = CLOSING_OPTIONS.find((item) => item.id === optionId);
      if (!option) return;
      setSelectedClosingId(optionId);
      commit((current) => ({
        ...current,
        closingText: fillTemplate(option.template, getTemplateVars(current)),
      }));
    },
    [commit]
  );

  return {
    data,
    selectedIntroId,
    selectedMotivationId,
    selectedClosingId,
    setIntroOption,
    setMotivationOption,
    setClosingOption,
    updateField,
    loadFromJobOffer,
    resetDraft,
    syncFromStore,
  };
}
