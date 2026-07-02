import type { RankInfo, RankTier } from '@/types/rank';

const TIER_LABELS: Record<RankTier, string> = {
  bronze: 'Bronze',
  silver: 'Argent',
  gold: 'Or',
  platinum: 'Platine',
  diamond: 'Diamant',
  champion: 'Champion',
};

export const RANK_TIERS = [
  { tier: 'bronze' as const, min: 0, max: 166, color: '#CD7F32', icon: '🥉' },
  { tier: 'silver' as const, min: 167, max: 333, color: '#C0C0C0', icon: '🥈' },
  { tier: 'gold' as const, min: 334, max: 500, color: '#FFD700', icon: '🥇' },
  { tier: 'platinum' as const, min: 501, max: 667, color: '#4FD1D9', icon: '💎' },
  { tier: 'diamond' as const, min: 668, max: 833, color: '#B57EDC', icon: '💠' },
  { tier: 'champion' as const, min: 834, max: 1000, color: '#FFD700', icon: '👑' },
];

const SUB_LEVEL_ROMAN: Record<1 | 2 | 3, string> = {
  3: 'III',
  2: 'II',
  1: 'I',
};

export function calculateRank(score: number): RankInfo {
  const clamped = Math.max(0, Math.min(1000, score));
  const tierDef =
    RANK_TIERS.find((tier) => clamped >= tier.min && clamped <= tier.max) ?? RANK_TIERS[0];

  if (tierDef.tier === 'champion') {
    const range = tierDef.max - tierDef.min + 1;
    const offset = clamped - tierDef.min;
    return {
      tier: 'champion',
      subLevel: null,
      label: TIER_LABELS.champion,
      minScore: tierDef.min,
      maxScore: tierDef.max,
      color: tierDef.color,
      icon: tierDef.icon,
      progressToNextRank: range > 0 ? offset / range : 1,
      pointsToNextRank: null,
    };
  }

  const range = tierDef.max - tierDef.min + 1;
  const subSize = range / 3;
  const offset = clamped - tierDef.min;
  const subIndex = Math.min(2, Math.floor(offset / subSize));
  const subLevel = ([3, 2, 1] as const)[subIndex];
  const subStart = tierDef.min + subIndex * subSize;
  const subEnd = subIndex === 2 ? tierDef.max : subStart + subSize - 1;
  const subProgress = subEnd > subStart ? (clamped - subStart) / (subEnd - subStart) : 1;

  const nextThreshold =
    subIndex === 2
      ? RANK_TIERS[RANK_TIERS.findIndex((t) => t.tier === tierDef.tier) + 1]?.min ?? null
      : Math.ceil(subStart + subSize);

  return {
    tier: tierDef.tier,
    subLevel,
    label: `${TIER_LABELS[tierDef.tier]} ${SUB_LEVEL_ROMAN[subLevel]}`,
    minScore: tierDef.min,
    maxScore: tierDef.max,
    color: tierDef.color,
    icon: tierDef.icon,
    progressToNextRank: Math.max(0, Math.min(1, subProgress)),
    pointsToNextRank: nextThreshold != null ? Math.max(0, nextThreshold - clamped) : null,
  };
}
