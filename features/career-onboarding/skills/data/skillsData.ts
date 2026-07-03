import type { Skill, UserSkill } from '../types';

export const SKILLS: Skill[] = [
  { id: 'dev-web', label: 'Développement web', category: 'tech' },
  { id: 'dev-mobile', label: 'Développement mobile', category: 'tech' },
  { id: 'python', label: 'Python', category: 'tech' },
  { id: 'data-analyse', label: 'Data / Analyse', category: 'tech' },
  { id: 'ia', label: 'Intelligence artificielle', category: 'tech' },
  { id: 'cybersecurite', label: 'Cybersécurité', category: 'tech' },
  { id: 'cloud', label: 'Cloud (AWS/Azure/GCP)', category: 'tech' },
  { id: 'no-code', label: 'No-code', category: 'tech' },
  { id: 'product-ux', label: 'Product / UX', category: 'tech' },
  { id: 'gestion-projet', label: 'Gestion de projet', category: 'business' },
  { id: 'vente-negociation', label: 'Vente / Négociation', category: 'business' },
  { id: 'marketing-digital', label: 'Marketing digital', category: 'business' },
  { id: 'finance-compta', label: 'Finance / Comptabilité', category: 'business' },
  { id: 'rh', label: 'Ressources humaines', category: 'business' },
  { id: 'droit', label: 'Droit', category: 'business' },
  { id: 'design', label: 'Design (UI/UX, graphique)', category: 'creative' },
  { id: 'redaction', label: 'Rédaction / Copywriting', category: 'creative' },
  { id: 'reseaux-sociaux', label: 'Réseaux sociaux', category: 'creative' },
  { id: 'photo-video', label: 'Photo / Vidéo', category: 'creative' },
  { id: 'communication', label: 'Communication', category: 'soft_skills' },
  { id: 'leadership', label: 'Leadership', category: 'soft_skills' },
  { id: 'travail-equipe', label: "Travail d'équipe", category: 'soft_skills' },
  { id: 'gestion-stress', label: 'Gestion du stress', category: 'soft_skills' },
  { id: 'prise-parole', label: 'Prise de parole en public', category: 'soft_skills' },
  { id: 'langues', label: 'Langues étrangères', category: 'soft_skills' },
  { id: 'adaptabilite', label: 'Adaptabilité', category: 'soft_skills' },
  { id: 'btp', label: 'BTP / Artisanat', category: 'manual' },
  { id: 'logistique', label: 'Logistique', category: 'manual' },
  { id: 'restauration', label: 'Restauration', category: 'manual' },
  { id: 'mecanique', label: 'Mécanique / Technique', category: 'manual' },
  { id: 'soins', label: 'Soins / Accompagnement', category: 'health_social' },
  { id: 'enseignement', label: 'Enseignement / Formation', category: 'health_social' },
  { id: 'travail-social', label: 'Travail social', category: 'health_social' },
];

export const SKILLS_BY_ID = new Map(SKILLS.map((skill) => [skill.id, skill]));

export const SUGGESTIONS_BY_FIELD: Record<string, string[]> = {
  Informatique: ['dev-web', 'python', 'data-analyse', 'ia'],
  'Commerce / Gestion': ['vente-negociation', 'gestion-projet', 'marketing-digital'],
  Ingénierie: ['gestion-projet', 'data-analyse', 'mecanique'],
  'Marketing / Communication': ['marketing-digital', 'reseaux-sociaux', 'redaction'],
  Finance: ['finance-compta', 'data-analyse'],
  'Design / Arts': ['design', 'photo-video'],
  'Santé / Social': ['soins', 'travail-social'],
  Droit: ['droit', 'communication'],
  default: ['communication', 'travail-equipe', 'adaptabilite'],
};

export const SUGGESTIONS_BY_ROLE_KEYWORD: Record<string, string[]> = {
  développeur: ['dev-web', 'python', 'data-analyse', 'ia'],
  developpeur: ['dev-web', 'python', 'data-analyse', 'ia'],
  informatique: ['dev-web', 'python', 'cybersecurite', 'cloud'],
  commercial: ['vente-negociation', 'communication', 'negociation'],
  vente: ['vente-negociation', 'communication'],
  marketing: ['marketing-digital', 'reseaux-sociaux', 'redaction'],
  communication: ['redaction', 'reseaux-sociaux', 'communication'],
  finance: ['finance-compta', 'data-analyse'],
  comptab: ['finance-compta', 'gestion-projet'],
  design: ['design', 'photo-video'],
  rh: ['rh', 'communication'],
  'ressources humaines': ['rh', 'communication'],
  santé: ['soins', 'travail-social'],
  sante: ['soins', 'travail-social'],
  social: ['travail-social', 'communication'],
  enseign: ['enseignement', 'communication'],
  formation: ['enseignement', 'communication'],
  ingénieur: ['gestion-projet', 'data-analyse'],
  ingenieur: ['gestion-projet', 'data-analyse'],
  'chef de projet': ['gestion-projet', 'leadership', 'communication'],
  data: ['data-analyse', 'python', 'ia'],
  product: ['product-ux', 'gestion-projet', 'communication'],
  juriste: ['droit', 'communication'],
  infirmier: ['soins', 'communication'],
  btp: ['btp', 'gestion-projet'],
  logistique: ['logistique', 'gestion-projet'],
};

export function getSuggestedSkills(targetRoles: string[]): Skill[] {
  if (!targetRoles || targetRoles.length === 0) {
    return SKILLS.filter((skill) => SUGGESTIONS_BY_FIELD.default.includes(skill.id));
  }

  const matchedIds = new Set<string>();

  for (const role of targetRoles) {
    const roleLower = role.toLowerCase();
    for (const [keyword, skillIds] of Object.entries(SUGGESTIONS_BY_ROLE_KEYWORD)) {
      if (roleLower.includes(keyword)) {
        skillIds.forEach((id) => matchedIds.add(id));
      }
    }
  }

  if (matchedIds.size === 0) {
    return SKILLS.filter((skill) => SUGGESTIONS_BY_FIELD.default.includes(skill.id));
  }

  return SKILLS.filter((skill) => matchedIds.has(skill.id)).slice(0, 6);
}

export function getSuggestedSkillsForProfile(profile: { targetRoles: string[] }): Skill[] {
  return getSuggestedSkills(profile.targetRoles);
}

export function searchSkills(query: string, excludeIds: string[]): Skill[] {
  if (!query.trim()) return [];
  const normalized = query.toLowerCase().trim();
  return SKILLS.filter(
    (skill) =>
      !excludeIds.includes(skill.id) && skill.label.toLowerCase().includes(normalized)
  ).slice(0, 8);
}

export function slugifySkillLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

/** Normalise les profils persistés (ancien format skillId / string[]). */
export function normalizeUserSkills(raw: unknown): UserSkill[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  if (typeof raw[0] === 'string') {
    const now = new Date().toISOString();
    return (raw as string[])
      .map((id) => {
        const skill = SKILLS_BY_ID.get(id);
        if (!skill) return null;
        return {
          id: skill.id,
          label: skill.label,
          category: skill.category,
          level: 'intermediate' as const,
          addedAt: now,
        };
      })
      .filter((skill): skill is UserSkill => skill !== null);
  }

  return (raw as Record<string, unknown>[]).map((entry) => {
    if ('id' in entry && 'label' in entry && 'category' in entry) {
      return entry as UserSkill;
    }

    const legacyId = (entry.skillId ?? entry.id) as string;
    const catalogSkill = SKILLS_BY_ID.get(legacyId);
    return {
      id: legacyId,
      label: (entry.label as string) ?? catalogSkill?.label ?? legacyId,
      category: (entry.category as UserSkill['category']) ?? catalogSkill?.category ?? 'other',
      level: (entry.level as UserSkill['level']) ?? 'intermediate',
      addedAt: (entry.addedAt as string) ?? new Date().toISOString(),
    };
  });
}
