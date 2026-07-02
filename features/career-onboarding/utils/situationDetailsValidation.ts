import type { SituationDetails } from '@/types/onboarding';

import type { CurrentSituation } from '../types';

export function isSituationDetailsComplete(
  situation: CurrentSituation | null,
  details: SituationDetails
): boolean {
  if (!situation) return false;

  switch (situation) {
    case 'lyceen': {
      if (!details.classe || !details.filiere) return false;
      if (details.filiere === 'general') {
        return (details.specialites?.length ?? 0) >= 1;
      }
      if (details.filiere === 'techno') {
        return Boolean(details.serieTechno);
      }
      if (details.filiere === 'pro') {
        return Boolean(details.filiereProLibre?.trim());
      }
      return false;
    }
    case 'bac2': {
      if (!details.typeBacPlus2 || !details.specialiteBacPlus2) return false;
      if (details.specialiteBacPlus2 === 'autre-bts') {
        return Boolean(details.specialiteBacPlus2Libre?.trim());
      }
      return true;
    }
    case 'etudiant':
      return Boolean(details.niveauEtudes);
    case 'etudiant-grande-ecole':
      return Boolean(details.niveauGrandeEcole);
    case 'alternant':
      return Boolean(details.niveauEtudes && details.typeContratAlternance);
    case 'en-poste':
    case 'freelance':
      return Boolean(details.secteurActivite);
    case 'jeune-diplome':
    case 'recherche-emploi':
    case 'sans-emploi':
    case 'autre':
    case 'entrepreneur':
    case 'reconversion':
    case 'pause-carriere':
    case 'retraite-actif':
      return true;
    default:
      return true;
  }
}
