export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'champion';

export interface RankInfo {
  tier: RankTier;
  subLevel: 1 | 2 | 3 | null;
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
  icon: string;
  progressToNextRank: number;
  pointsToNextRank: number | null;
}
