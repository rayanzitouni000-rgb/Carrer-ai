import type { CareerProfile } from '../types';

const KEYWORD_SKILL_MAP: { keywords: string[]; skillIds: string[] }[] = [
  {
    keywords: ['informatique', 'info', 'dev', 'software', 'ia', 'data'],
    skillIds: ['developpement-web', 'python', 'data-analyse'],
  },
  { keywords: ['marketing', 'communication', 'digital'], skillIds: ['marketing-digital', 'reseaux-sociaux'] },
  { keywords: ['design', 'ux', 'ui'], skillIds: ['design-ui-ux', 'product-ux'] },
  { keywords: ['commerce', 'business', 'gestion', 'finance'], skillIds: ['vente-negociation', 'gestion-projet'] },
  { keywords: ['santé', 'sante', 'infirmier', 'medical'], skillIds: ['soins-accompagnement'] },
  { keywords: ['ingénieur', 'ingenieur'], skillIds: ['mecanique-technique', 'gestion-projet'] },
];

export function suggestSkillsFromEducation(profile: CareerProfile): string[] {
  const suggestions = new Set<string>();
  const text = [
    profile.situationDetails.masterSpecialite,
    profile.situationDetails.specialiteBacPlus2Libre,
    profile.diploma,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  KEYWORD_SKILL_MAP.forEach(({ keywords, skillIds }) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      skillIds.forEach((id) => suggestions.add(id));
    }
  });

  return Array.from(suggestions);
}
