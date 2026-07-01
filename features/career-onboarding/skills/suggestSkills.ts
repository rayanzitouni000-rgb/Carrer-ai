import type { FieldOfStudy } from '../types';

const FIELD_SKILL_MAP: Record<FieldOfStudy, string[]> = {
  informatique: ['developpement-web', 'python', 'data-analyse', 'intelligence-artificielle'],
  'commerce-gestion': ['vente-negociation', 'gestion-projet', 'marketing-digital'],
  ingenierie: ['mecanique-technique', 'gestion-projet', 'developpement-web'],
  'marketing-communication': ['marketing-digital', 'reseaux-sociaux', 'redaction-copywriting'],
  'finance-comptabilite': ['finance-comptabilite', 'data-analyse', 'gestion-projet'],
  'design-arts': ['design-ui-ux', 'photo-video', 'redaction-copywriting'],
  'sante-social': ['soins-accompagnement', 'travail-social', 'communication'],
  droit: ['droit', 'negociation', 'communication'],
  sciences: ['data-analyse', 'python', 'enseignement-formation'],
  education: ['enseignement-formation', 'communication', 'travail-equipe'],
  artisanat: ['btp-artisanat', 'mecanique-technique', 'logistique'],
  autre: ['communication', 'adaptabilite', 'gestion-projet'],
};

const DIPLOMA_KEYWORD_SKILLS: { keywords: string[]; skillIds: string[] }[] = [
  { keywords: ['informatique', 'info', 'dev', 'software'], skillIds: ['developpement-web', 'python'] },
  { keywords: ['data', 'analyste', 'bi'], skillIds: ['data-analyse'] },
  { keywords: ['marketing', 'communication'], skillIds: ['marketing-digital', 'reseaux-sociaux'] },
  { keywords: ['design', 'ux', 'ui'], skillIds: ['design-ui-ux', 'product-ux'] },
  { keywords: ['commerce', 'business', 'gestion'], skillIds: ['vente-negociation', 'gestion-projet'] },
  { keywords: ['santé', 'sante', 'infirmier', 'medical'], skillIds: ['soins-accompagnement'] },
  { keywords: ['ingénieur', 'ingenieur'], skillIds: ['mecanique-technique', 'gestion-projet'] },
];

export function suggestSkillsFromEducation(
  field: FieldOfStudy | null,
  diploma: string
): string[] {
  const suggestions = new Set<string>();

  if (field) {
    FIELD_SKILL_MAP[field]?.forEach((id) => suggestions.add(id));
  }

  const normalizedDiploma = diploma.toLowerCase();
  DIPLOMA_KEYWORD_SKILLS.forEach(({ keywords, skillIds }) => {
    if (keywords.some((keyword) => normalizedDiploma.includes(keyword))) {
      skillIds.forEach((id) => suggestions.add(id));
    }
  });

  return Array.from(suggestions);
}
