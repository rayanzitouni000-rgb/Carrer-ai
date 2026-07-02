/** Contexte transmis de l'analyse CV vers la génération IA. */
export interface CvAnalysisGenerationContext {
  /** Points faibles / axes d'amélioration identifiés par l'analyse. */
  improvements: string[];
  /** Recommandation IA principale. */
  aiRecommendation: string | null;
  /** Score Career Score au moment de l'analyse. */
  careerScore: number | null;
  /** Nom du fichier analysé. */
  sourceFileName: string | null;
  /** Horodatage ISO de l'analyse source. */
  analyzedAt: string;
}
