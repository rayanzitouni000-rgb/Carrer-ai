import type { CoverLetterData } from '@/types/coverLetter';
import { EMPTY_COVER_LETTER } from '@/types/coverLetter';

/** Brouillon partagé entre template, preview et retour arrière. */
let draft: CoverLetterData | null = null;

export const coverLetterStore = {
  get(): CoverLetterData | null {
    return draft;
  },

  getOrEmpty(): CoverLetterData {
    return draft ?? { ...EMPTY_COVER_LETTER };
  },

  set(data: CoverLetterData): void {
    draft = data;
  },

  reset(): void {
    draft = null;
  },
};
