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
