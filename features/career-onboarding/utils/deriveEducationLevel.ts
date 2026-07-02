import type { EducationLevel } from '../types';
import type { CareerProfile } from '../types';

/** Déduit le niveau d'études depuis la situation et les détails collectés. */
export function deriveEducationLevel(
  profile: Pick<CareerProfile, 'currentSituation' | 'situationDetails'>
): EducationLevel | null {
  const { currentSituation, situationDetails: d } = profile;

  switch (currentSituation) {
    case 'lyceen':
      if (d.filiere === 'techno') return 'bac-techno';
      if (d.filiere === 'pro') return 'bac-pro';
      return 'bac-general';
    case 'bac2':
      return 'bac-2';
    case 'etudiant':
    case 'alternant':
      switch (d.typeCursus) {
        case 'licence-univ':
          return 'bac-3';
        case 'bachelor-ecole':
          return 'commerce-ecole';
        case 'master-univ':
        case 'master-ecole':
          return 'bac-5-master';
        case 'doctorat':
          return 'doctorat';
        case 'classe-prepa':
          return 'bac-general';
        default:
          return null;
      }
    default:
      return null;
  }
}
