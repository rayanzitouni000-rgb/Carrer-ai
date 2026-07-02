import type { SituationDetails } from '@/types/onboarding';
import { EMPTY_SITUATION_DETAILS } from '@/types/onboarding';

import type { CareerProfile, CurrentSituation } from '../types';
import { EMPTY_CAREER_PROFILE } from '../types';
import { normalizeUserSkills } from './data/skillsData';
import { SKILL_LEVEL_CONFIG } from './types';
import type { UserSkill } from './types';

export function formatUserSkillLabel(userSkill: UserSkill): string {
  const level = SKILL_LEVEL_CONFIG[userSkill.level].label;
  return `${userSkill.label} (${level})`;
}

export function formatUserSkillsSummary(skills: UserSkill[]): string {
  if (skills.length === 0) return '—';
  return skills.map(formatUserSkillLabel).join(' · ');
}

type LegacySituationDetails = SituationDetails & {
  niveauEtudes?: string;
  niveauGrandeEcole?: string;
};

type LegacyCareerProfile = Partial<CareerProfile> & {
  opportunityType?: unknown;
  opportunityTypes?: unknown;
  fieldOfStudy?: unknown;
  situationDetails?: LegacySituationDetails;
  currentSituation?: CurrentSituation | 'etudiant-grande-ecole' | null;
};

function migrateLegacyCursus(details: LegacySituationDetails): SituationDetails {
  if (details.typeCursus) {
    const { niveauEtudes: _ne, niveauGrandeEcole: _ng, ...rest } = details;
    return rest;
  }

  const migrated: SituationDetails = { ...details };

  if (details.niveauGrandeEcole) {
    const niveau = details.niveauGrandeEcole;
    if (niveau.startsWith('bachelor')) {
      migrated.typeCursus = 'bachelor-ecole';
      migrated.niveauCursus = niveau;
    } else if (niveau === 'master1-ecole' || niveau === 'master2-ecole') {
      migrated.typeCursus = 'master-ecole';
      migrated.niveauCursus = niveau === 'master1-ecole' ? 'm1' : 'm2';
    }
  } else if (details.niveauEtudes) {
    const niveau = details.niveauEtudes;
    if (niveau === 'l1' || niveau === 'l2' || niveau === 'l3') {
      migrated.typeCursus = 'licence-univ';
      migrated.niveauCursus = niveau;
    } else if (niveau === 'm1' || niveau === 'm2') {
      migrated.typeCursus = 'master-univ';
      migrated.niveauCursus = niveau;
    } else if (niveau === 'doctorat-en-cours') {
      migrated.typeCursus = 'doctorat';
    } else if (niveau === 'classe-prepa') {
      migrated.typeCursus = 'classe-prepa';
    }
  }

  delete (migrated as LegacySituationDetails).niveauEtudes;
  delete (migrated as LegacySituationDetails).niveauGrandeEcole;

  return migrated;
}

function migrateCurrentSituation(
  situation: CurrentSituation | 'etudiant-grande-ecole' | null | undefined
): CurrentSituation | null {
  if (!situation) return null;
  if (situation === 'etudiant-grande-ecole') return 'etudiant';
  return situation;
}

export function normalizeCareerProfile(raw: LegacyCareerProfile): CareerProfile {
  const { opportunityType: _o, opportunityTypes: _os, fieldOfStudy: _f, ...rest } = raw;

  const currentSituation = migrateCurrentSituation(rest.currentSituation ?? null);
  const situationDetails = migrateLegacyCursus({
    ...EMPTY_SITUATION_DETAILS,
    ...(rest.situationDetails ?? {}),
  });

  return {
    ...EMPTY_CAREER_PROFILE,
    ...rest,
    currentSituation,
    situationDetails,
    experiences: Array.isArray(rest.experiences) ? rest.experiences : [],
    hasNoExperience: rest.hasNoExperience ?? false,
    targetRoles: Array.isArray(rest.targetRoles) ? rest.targetRoles : [],
    skills: normalizeUserSkills(rest.skills),
  };
}
