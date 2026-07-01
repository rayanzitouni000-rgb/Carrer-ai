import {
  EDUCATION_LEVEL_OPTIONS,
  FIELD_OPTIONS,
  getOptionLabel,
} from '@/features/career-onboarding/constants';
import type { CareerProfile } from '@/features/career-onboarding/types';
import type {
  GeneratedCvData,
  GeneratedCvEducation,
  GeneratedCvExperience,
} from '@/types/cvGenerator';
import { EMPTY_GENERATED_CV } from '@/types/cvGenerator';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildEducation(profile: CareerProfile): GeneratedCvEducation[] {
  const level = getOptionLabel(EDUCATION_LEVEL_OPTIONS, profile.educationLevel);
  const field = getOptionLabel(FIELD_OPTIONS, profile.fieldOfStudy);
  const diploma = profile.diploma?.trim();

  const degree = diploma || [level, field].filter((v) => v && v !== '—').join(' · ');

  if (!degree) return [];

  return [
    {
      id: createId('edu'),
      degree,
      school: field !== '—' ? field : '',
      year: '',
    },
  ];
}

/** Pré-remplit le CV depuis le profil onboarding. Champs modifiables ensuite. */
export function buildCvDataFromProfile(profile: CareerProfile): GeneratedCvData {
  const experiences: GeneratedCvExperience[] = (profile.experiences ?? [])
    .filter((exp) => exp.jobTitle.trim().length > 0)
    .map((exp) => ({
      id: exp.id || createId('exp'),
      jobTitle: exp.jobTitle,
      company: exp.company,
      duration: exp.duration,
    }));

  const skills = (profile.skills ?? []).map((skill) => skill.label);
  const headline = (profile.targetRoles ?? [])[0] ?? '';

  return {
    ...EMPTY_GENERATED_CV,
    fullName: profile.firstName?.trim() ?? '',
    headline,
    experiences,
    education: buildEducation(profile),
    skills,
  };
}
