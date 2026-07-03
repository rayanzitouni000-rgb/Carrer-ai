import type { CareerProfile } from '../types';
import { JOB_ROLES, type JobRole } from '../data/jobRolesData';

const SECTEUR_TO_ROLE_IDS: Record<string, string[]> = {
  tech: [
    'dev-front',
    'dev-back',
    'dev-fullstack',
    'dev-mobile',
    'data-analyst',
    'data-scientist',
    'devops',
    'cybersecurite',
    'product-manager',
    'product-owner',
    'designer',
  ],
  commerce: ['commercial', 'business-developer', 'vendeur', 'caissier', 'marketing'],
  sante: ['infirmier', 'aide-soignant', 'medecin', 'kinesitherapeute', 'pharmacien'],
  finance: ['comptable', 'controleur-gestion', 'auditeur', 'consultant'],
  industrie: ['technicien', 'logisticien', 'magasinier', 'mecanicien'],
  btp: ['btp', 'electricien', 'plombier', 'conducteur-engins', 'mecanicien', 'architecte'],
  education: ['enseignant', 'educateur'],
  'marketing-com': ['marketing', 'community-manager', 'redacteur', 'graphiste', 'journaliste'],
  rh: ['rh', 'assistant-rh'],
  juridique: ['juriste', 'avocat'],
  restauration: ['serveur', 'cuisinier'],
  artisanat: ['coiffeur', 'estheticien', 'electricien', 'plombier'],
  'autre-secteur': [],
};

const SPECIALITE_ID_TO_ROLE_IDS: Record<string, string[]> = {
  mco: ['commercial', 'vendeur', 'business-developer'],
  ndrc: ['commercial', 'business-developer'],
  'commerce-international': ['commercial', 'business-developer'],
  gpme: ['commercial', 'assistant-admin', 'controleur-gestion'],
  'comptabilite-gestion': ['comptable', 'controleur-gestion', 'auditeur'],
  sam: ['assistant-admin', 'assistant-rh'],
  assurance: ['commercial', 'consultant'],
  banque: ['comptable', 'consultant'],
  immobilier: ['agent-immobilier', 'commercial'],
  sio: ['dev-front', 'dev-back', 'cybersecurite'],
  sn: ['technicien', 'devops'],
  cybersecurite: ['cybersecurite', 'devops'],
  cpi: ['technicien', 'mecanicien'],
  electrotechnique: ['electricien', 'technicien'],
  'maintenance-systemes': ['technicien', 'mecanicien'],
  batiment: ['btp', 'conducteur-engins'],
  'travaux-publics': ['btp', 'conducteur-engins'],
  'economie-construction': ['btp', 'architecte'],
  'analyses-biomedicales': ['technicien'],
  dietetique: ['infirmier'],
  prothesiste: ['technicien'],
  sp3s: ['aide-soignant', 'social'],
  esf: ['social', 'assistant-rh'],
  'design-communication': ['graphiste', 'designer'],
  'design-graphique': ['graphiste', 'designer'],
  'design-produits': ['designer', 'technicien'],
  communication: ['marketing', 'community-manager', 'redacteur'],
  tourisme: ['commercial', 'serveur'],
  'hotellerie-restauration': ['serveur', 'cuisinier'],
  gtla: ['logisticien', 'magasinier'],
  tc: ['commercial', 'vendeur', 'marketing'],
  gaco: ['assistant-admin', 'commercial'],
  gea: ['controleur-gestion', 'assistant-rh', 'commercial'],
  'informatique-but': ['dev-front', 'dev-fullstack', 'data-analyst'],
  'info-com': ['marketing', 'community-manager', 'redacteur'],
  mmi: ['designer', 'graphiste', 'dev-front'],
  'carrieres-juridiques': ['juriste', 'avocat'],
  'carrieres-sociales': ['social', 'educateur'],
  'genie-civil': ['btp', 'architecte'],
  'genie-mecanique': ['technicien', 'mecanicien'],
  'genie-industriel': ['technicien', 'logisticien'],
  geii: ['electricien', 'technicien', 'devops'],
};

const KEYWORD_RULES: Array<{ keywords: string[]; roleIds: string[] }> = [
  {
    keywords: ['commerce', 'vente', 'commercial', 'mco', 'ndrc', 'distribution', 'retail'],
    roleIds: ['commercial', 'vendeur', 'business-developer'],
  },
  {
    keywords: ['marketing', 'communication', 'digital', 'community'],
    roleIds: ['marketing', 'community-manager', 'redacteur'],
  },
  {
    keywords: ['informatique', 'info', 'dev', 'software', 'sio', 'data', 'ia', 'web'],
    roleIds: ['dev-front', 'dev-back', 'dev-fullstack', 'data-analyst'],
  },
  {
    keywords: ['compta', 'finance', 'banque', 'audit', 'gestion'],
    roleIds: ['comptable', 'controleur-gestion', 'auditeur'],
  },
  {
    keywords: ['santé', 'sante', 'soin', 'infirm', 'médical', 'medical'],
    roleIds: ['infirmier', 'aide-soignant', 'medecin'],
  },
  {
    keywords: ['social', 'éducation', 'education', 'enseign'],
    roleIds: ['enseignant', 'educateur', 'social'],
  },
  {
    keywords: ['droit', 'jurid', 'avocat'],
    roleIds: ['juriste', 'avocat'],
  },
  {
    keywords: ['btp', 'construction', 'bâtiment', 'batiment', 'travaux'],
    roleIds: ['btp', 'electricien', 'plombier'],
  },
  {
    keywords: ['restauration', 'hôtellerie', 'hotellerie', 'cuisine', 'serveur'],
    roleIds: ['serveur', 'cuisinier'],
  },
  {
    keywords: ['design', 'graphique', 'ux', 'ui'],
    roleIds: ['designer', 'graphiste'],
  },
  {
    keywords: ['logistique', 'transport', 'supply'],
    roleIds: ['logisticien', 'magasinier'],
  },
  {
    keywords: ['rh', 'recrutement', 'ressources humaines'],
    roleIds: ['rh', 'assistant-rh'],
  },
];

function rolesFromIds(roleIds: string[]): JobRole[] {
  const seen = new Set<string>();
  const roles: JobRole[] = [];
  for (const id of roleIds) {
    if (seen.has(id)) continue;
    const role = JOB_ROLES.find((item) => item.id === id);
    if (role) {
      seen.add(id);
      roles.push(role);
    }
  }
  return roles;
}

function matchRolesFromText(text: string): JobRole[] {
  const normalized = text.toLowerCase();
  const matchedIds = new Set<string>();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      rule.roleIds.forEach((id) => matchedIds.add(id));
    }
  }

  return rolesFromIds(Array.from(matchedIds));
}

function getEducationContextText(profile: CareerProfile): string {
  const { situationDetails } = profile;
  return [
    situationDetails.specialiteBacPlus2Libre,
    situationDetails.masterSpecialite,
    situationDetails.filiereProLibre,
    situationDetails.serieTechno,
    profile.diploma,
    ...(situationDetails.specialites ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

function getRolesFromEducation(profile: CareerProfile): JobRole[] {
  const { situationDetails } = profile;
  const roleIds = new Set<string>();

  if (situationDetails.specialiteBacPlus2) {
    const mapped = SPECIALITE_ID_TO_ROLE_IDS[situationDetails.specialiteBacPlus2];
    mapped?.forEach((id) => roleIds.add(id));
  }

  const contextText = getEducationContextText(profile);
  if (contextText) {
    matchRolesFromText(contextText).forEach((role) => roleIds.add(role.id));
  }

  return rolesFromIds(Array.from(roleIds));
}

function getRolesFromSecteur(profile: CareerProfile): JobRole[] {
  const secteur = profile.situationDetails.secteurActivite;
  if (!secteur || secteur === 'autre-secteur') return [];

  const situation = profile.currentSituation;
  if (situation !== 'en-poste' && situation !== 'freelance') return [];

  return rolesFromIds(SECTEUR_TO_ROLE_IDS[secteur] ?? []);
}

/** Pool de postes pertinents selon le parcours déjà renseigné (vide si aucune donnée exploitable). */
export function getProfileRelevantJobRoles(profile: CareerProfile): JobRole[] {
  const fromSecteur = getRolesFromSecteur(profile);
  if (fromSecteur.length > 0) return fromSecteur;

  return getRolesFromEducation(profile);
}
