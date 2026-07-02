import { EDUCATION_LEVEL_OPTIONS, getOptionLabel } from '@/features/career-onboarding/constants';
import { formatProfileEducationSummary } from '@/features/career-onboarding/utils/profileEducationLabel';
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
  const summary = formatProfileEducationSummary(profile);
  const diploma = profile.diploma?.trim();
  const level = getOptionLabel(EDUCATION_LEVEL_OPTIONS, profile.educationLevel);

  const degree = diploma || (summary !== '—' ? summary : level !== '—' ? level : '');

  if (!degree) return [];

  const school =
    profile.situationDetails.masterSpecialite?.trim() ||
    (summary !== '—' ? summary.split(' · ').slice(-1)[0] : '');

  return [
    {
      id: createId('edu'),
      degree,
      school: school !== degree ? school : '',
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
