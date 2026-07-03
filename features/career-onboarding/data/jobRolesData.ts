import { Briefcase } from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';

export interface JobRole {
  id: string;
  label: string;
}

export const MAX_TARGET_ROLES = 3;

export const JOB_ROLES: JobRole[] = [
  { id: 'dev-front', label: 'Développeur Front-end' },
  { id: 'dev-back', label: 'Développeur Back-end' },
  { id: 'dev-fullstack', label: 'Développeur Full-stack' },
  { id: 'dev-mobile', label: 'Développeur Mobile' },
  { id: 'data-analyst', label: 'Data Analyst' },
  { id: 'data-scientist', label: 'Data Scientist' },
  { id: 'devops', label: 'DevOps / SRE' },
  { id: 'cybersecurite', label: 'Expert Cybersécurité' },
  { id: 'product-manager', label: 'Product Manager' },
  { id: 'product-owner', label: 'Product Owner' },
  { id: 'chef-projet', label: 'Chef de projet' },
  { id: 'scrum-master', label: 'Scrum Master' },
  { id: 'designer', label: 'Designer UI/UX' },
  { id: 'graphiste', label: 'Graphiste' },
  { id: 'marketing', label: 'Chargé(e) de marketing' },
  { id: 'community-manager', label: 'Community Manager' },
  { id: 'commercial', label: 'Commercial(e)' },
  { id: 'business-developer', label: 'Business Developer' },
  { id: 'comptable', label: 'Comptable' },
  { id: 'controleur-gestion', label: 'Contrôleur de gestion' },
  { id: 'rh', label: 'Chargé(e) de recrutement / RH' },
  { id: 'assistant-rh', label: 'Assistant(e) RH' },
  { id: 'juriste', label: 'Juriste' },
  { id: 'avocat', label: 'Avocat(e)' },
  { id: 'infirmier', label: 'Infirmier(ère)' },
  { id: 'aide-soignant', label: 'Aide-soignant(e)' },
  { id: 'medecin', label: 'Médecin' },
  { id: 'kinesitherapeute', label: 'Kinésithérapeute' },
  { id: 'enseignant', label: 'Enseignant(e) / Formateur(trice)' },
  { id: 'assistant-admin', label: 'Assistant(e) administratif(ve)' },
  { id: 'secretaire', label: 'Secrétaire' },
  { id: 'technicien', label: 'Technicien(ne)' },
  { id: 'mecanicien', label: 'Mécanicien(ne)' },
  { id: 'electricien', label: 'Électricien(ne)' },
  { id: 'plombier', label: 'Plombier(ère)' },
  { id: 'btp', label: 'Ouvrier / Ouvrière BTP' },
  { id: 'conducteur-engins', label: 'Conducteur(trice) d’engins' },
  { id: 'logisticien', label: 'Logisticien(ne)' },
  { id: 'magasinier', label: 'Magasinier(ère)' },
  { id: 'vendeur', label: 'Vendeur(se)' },
  { id: 'caissier', label: 'Caissier(ère)' },
  { id: 'serveur', label: 'Serveur(se) / Restauration' },
  { id: 'cuisinier', label: 'Cuisinier(ère)' },
  { id: 'coiffeur', label: 'Coiffeur(se)' },
  { id: 'estheticien', label: 'Esthéticien(ne)' },
  { id: 'agent-immobilier', label: 'Agent immobilier' },
  { id: 'social', label: 'Travailleur(se) social(e)' },
  { id: 'educateur', label: 'Éducateur(trice) spécialisé(e)' },
  { id: 'psychologue', label: 'Psychologue' },
  { id: 'redacteur', label: 'Rédacteur(trice) / Copywriter' },
  { id: 'journaliste', label: 'Journaliste' },
  { id: 'consultant', label: 'Consultant(e)' },
  { id: 'auditeur', label: 'Auditeur(trice)' },
  { id: 'architecte', label: 'Architecte' },
  { id: 'pharmacien', label: 'Pharmacien(ne)' },
];

export const CUSTOM_ROLE_PREFIX = 'custom:';

export const JOB_ROLE_SELECT_OPTIONS: SelectOption[] = JOB_ROLES.map((role) => ({
  id: role.id,
  label: role.label,
  icon: Briefcase,
}));

export function jobRoleLabelToId(label: string): string {
  const match = JOB_ROLES.find((role) => role.label.toLowerCase() === label.toLowerCase());
  return match?.id ?? `${CUSTOM_ROLE_PREFIX}${encodeURIComponent(label)}`;
}

export function jobRoleIdToLabel(id: string): string {
  if (id.startsWith(CUSTOM_ROLE_PREFIX)) {
    return decodeURIComponent(id.slice(CUSTOM_ROLE_PREFIX.length));
  }
  return JOB_ROLES.find((role) => role.id === id)?.label ?? id;
}

export function buildJobRoleSelectOptions(selectedLabels: string[] = []): SelectOption[] {
  const customLabels = selectedLabels.filter(
    (label) => !JOB_ROLES.some((role) => role.label.toLowerCase() === label.toLowerCase())
  );

  const customOptions = customLabels.map((label) => ({
    id: jobRoleLabelToId(label),
    label,
    icon: Briefcase,
  }));

  return [...JOB_ROLE_SELECT_OPTIONS, ...customOptions];
}

/** Options limitées au parcours utilisateur + postes déjà sélectionnés (custom). */
export function buildProfileAwareJobRoleOptions(
  relevantRoles: JobRole[],
  selectedLabels: string[] = []
): SelectOption[] {
  const relevantOptions = relevantRoles.map((role) => ({
    id: role.id,
    label: role.label,
    icon: Briefcase,
  }));

  const knownLabels = new Set(
    [...relevantRoles.map((role) => role.label.toLowerCase()), ...JOB_ROLES.map((role) => role.label.toLowerCase())]
  );

  const customOptions = selectedLabels
    .filter((label) => !knownLabels.has(label.toLowerCase()))
    .map((label) => ({
      id: jobRoleLabelToId(label),
      label,
      icon: Briefcase,
    }));

  return [...relevantOptions, ...customOptions];
}

export function labelsToRoleIds(labels: string[]): string[] {
  return labels.map(jobRoleLabelToId);
}

export function filterSelectOptionsByQuery(
  query: string,
  options: SelectOption[]
): SelectOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;
  return options.filter((option) => option.label.toLowerCase().includes(normalized));
}

export function searchJobRoles(query: string, excludeLabels: string[]): JobRole[] {
  if (!query.trim()) return [];
  const normalized = query.toLowerCase().trim();
  const excludeSet = new Set(excludeLabels.map((label) => label.toLowerCase()));
  return JOB_ROLES.filter(
    (role) =>
      !excludeSet.has(role.label.toLowerCase()) &&
      role.label.toLowerCase().includes(normalized)
  ).slice(0, 8);
}
