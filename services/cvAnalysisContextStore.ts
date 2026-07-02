import type { CvAnalysisGenerationContext } from '@/features/cv-analyzer/types/cvAnalysisContext';

let context: CvAnalysisGenerationContext | null = null;

export const cvAnalysisContextStore = {
  get(): CvAnalysisGenerationContext | null {
    return context;
  },

  set(next: CvAnalysisGenerationContext): void {
    context = next;
  },

  clear(): void {
    context = null;
  },

  hasContext(): boolean {
    return context !== null;
  },
};
