export interface CvAnalysisApiResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export interface CvAnalysisResult extends CvAnalysisApiResult {
  fileName: string;
  analyzedAt: string;
}

export function scoreToRating(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Très bon';
  if (score >= 55) return 'Correct';
  return 'À améliorer';
}

export function scoreToCareerScoreValue(score: number): number {
  return Math.round(score * 10);
}
