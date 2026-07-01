import type { GeneratedCvData } from '@/types/cvGenerator';
import { EMPTY_GENERATED_CV } from '@/types/cvGenerator';

/**
 * Store en mémoire du brouillon de CV, partagé entre le formulaire et
 * l'aperçu (état conservé lors de la navigation form <-> preview).
 */
let draft: GeneratedCvData | null = null;

export const cvGeneratorStore = {
  get(): GeneratedCvData | null {
    return draft;
  },

  getOrEmpty(): GeneratedCvData {
    return draft ?? { ...EMPTY_GENERATED_CV };
  },

  set(data: GeneratedCvData): void {
    draft = data;
  },

  hasDraft(): boolean {
    return draft !== null;
  },

  reset(): void {
    draft = null;
  },
};
