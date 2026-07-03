export type CurrentSituation =
  | 'lyceen'
  | 'bac2'
  | 'etudiant'
  | 'alternant'
  | 'jeune-diplome'
  | 'recherche-emploi'
  | 'en-poste'
  | 'freelance'
  | 'sans-emploi'
  | 'autre'
  | 'entrepreneur'
  | 'reconversion'
  | 'pause-carriere'
  | 'retraite-actif';

export type EducationLevel =
  | 'college'
  | 'cap-bep'
  | 'bac-general'
  | 'bac-techno'
  | 'bac-pro'
  | 'bac-2'
  | 'bac-3'
  | 'bac-5-master'
  | 'ingenieur'
  | 'commerce-ecole'
  | 'doctorat'
  | 'autodidacte'
  | 'autre';

export type CareerGoalId =
  | 'premier-emploi'
  | 'reconversion'
  | 'evoluer-poste'
  | 'meilleur-emploi'
  | 'augmenter-salaire'
  | 'opportunites-etranger'
  | 'reussite-etudes'
  | 'freelance'
  | 'creer-entreprise'
  | 'alternance'
  | 'retour-apres-pause'
  | 'developper-competences'
  | 'bilan-competences'
  | 'stage'
  | 'retraite-active';

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  isCurrent: boolean;
}

import type { SituationDetails } from '@/types/onboarding';
import { EMPTY_SITUATION_DETAILS } from '@/types/onboarding';

import type { UserSkill } from './skills/types';

export type { Skill, UserSkill, SkillCategory, SkillLevel } from './skills/types';
export { MIN_USER_SKILLS, SKILL_LEVEL_CONFIG } from './skills/types';

export interface CareerProfile {
  firstName: string;
  dateOfBirth: string | null;
  currentSituation: CurrentSituation | null;
  situationDetails: SituationDetails;
  educationLevel: EducationLevel | null;
  diploma: string;
  experiences: WorkExperience[];
  hasNoExperience: boolean;
  careerGoal: CareerGoalId | null;
  targetRoles: string[];
  skills: UserSkill[];
  completedAt: string | null;
}

export const EMPTY_CAREER_PROFILE: CareerProfile = {
  firstName: '',
  dateOfBirth: null,
  currentSituation: null,
  situationDetails: { ...EMPTY_SITUATION_DETAILS },
  educationLevel: null,
  diploma: '',
  experiences: [],
  hasNoExperience: false,
  careerGoal: null,
  targetRoles: [],
  skills: [],
  completedAt: null,
};

export type CareerOnboardingStep =
  | 'welcome'
  | 'personal'
  | 'currentProfile'
  | 'educationDetails'
  | 'situation'
  | 'experience'
  | 'goal'
  | 'targetRole'
  | 'skills'
  | 'summary';

/** @deprecated Migrées vers educationDetails au chargement */
export type LegacyProfileSteps = 'target' | 'education' | 'educationLevel' | 'situation' | 'currentProfile';
