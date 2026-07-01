import type { CareerProfile } from '../types';
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

type LegacyCareerProfile = CareerProfile & {
  opportunityType?: unknown;
  opportunityTypes?: unknown;
};

export function normalizeCareerProfile(raw: LegacyCareerProfile): CareerProfile {
  const { opportunityType: _o, opportunityTypes: _os, ...rest } = raw;

  return {
    ...EMPTY_CAREER_PROFILE,
    ...rest,
    experiences: Array.isArray(rest.experiences) ? rest.experiences : [],
    hasNoExperience: rest.hasNoExperience ?? false,
    targetRoles: Array.isArray(rest.targetRoles) ? rest.targetRoles : [],
    skills: normalizeUserSkills(rest.skills),
  };
}
