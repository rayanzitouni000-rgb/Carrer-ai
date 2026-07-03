import type { CareerProfile } from '@/features/career-onboarding/types';
import type { JobOffer } from '@/types/jobMatch';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[\s,/\-·]+/)
    .filter((token) => token.length > 1);
}

function collectProfileKeywords(profile: CareerProfile): Set<string> {
  const keywords = new Set<string>();

  for (const role of profile.targetRoles) {
    for (const token of tokenize(role)) {
      keywords.add(token);
    }
  }

  for (const skill of profile.skills) {
    for (const token of tokenize(skill.label)) {
      keywords.add(token);
    }
  }

  return keywords;
}

function countMatches(keywords: Set<string>, targets: string[]): number {
  let matches = 0;
  for (const target of targets) {
    const normalized = normalize(target);
    if (keywords.has(normalized)) {
      matches += 1;
      continue;
    }
    for (const keyword of keywords) {
      if (normalized.includes(keyword) || keyword.includes(normalized)) {
        matches += 1;
        break;
      }
    }
  }
  return matches;
}

/**
 * Score de correspondance profil ↔ offre (0–100).
 * Logique simple par mots-clés — à remplacer par un scoring IA / API France Travail.
 */
export function calculateMatchScore(profile: CareerProfile, offer: Pick<JobOffer, 'title' | 'requiredSkills'>): number {
  const keywords = collectProfileKeywords(profile);
  if (keywords.size === 0) {
    return 72;
  }

  const titleTokens = tokenize(offer.title);
  const skillMatches = countMatches(keywords, offer.requiredSkills);
  const titleMatches = countMatches(keywords, titleTokens);

  const skillRatio = offer.requiredSkills.length > 0 ? skillMatches / offer.requiredSkills.length : 0;
  const titleRatio = titleTokens.length > 0 ? titleMatches / titleTokens.length : 0;

  const raw = skillRatio * 0.75 + titleRatio * 0.25;
  const score = Math.round(60 + raw * 35);

  return Math.min(95, Math.max(60, score));
}

export function enrichOffersWithMatchScore(profile: CareerProfile, offers: JobOffer[]): JobOffer[] {
  return offers.map((offer) => ({
    ...offer,
    matchScore: calculateMatchScore(profile, offer),
  }));
}

export function formatSalaryRange(min?: number, max?: number, contractType?: string): string {
  const isMonthly = contractType === 'Stage' || contractType === 'Alternance' || contractType === 'Freelance';

  const format = (value: number) => {
    if (isMonthly && value < 10000) {
      return `€${value.toLocaleString('fr-FR')}/mois`;
    }
    if (value >= 1000) {
      return `€${Math.round(value / 1000)}k`;
    }
    return `€${value.toLocaleString('fr-FR')}`;
  };

  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `À partir de ${format(min)}`;
  if (max) return `Jusqu'à ${format(max)}`;
  return 'Salaire non précisé';
}

export function getCompanyInitials(company: string): string {
  return company
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getCompanyColor(company: string): string {
  const palette = ['#1D4ED8', '#06B6D4', '#2B6CFF', '#EC4899', '#F59E0B', '#10B981', '#2B6CFF'];
  let hash = 0;
  for (let i = 0; i < company.length; i += 1) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
