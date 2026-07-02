import type { LucideIcon } from 'lucide-react-native';

export interface SelectOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export type TypeCursus =
  | 'licence-univ'
  | 'bachelor-ecole'
  | 'master-univ'
  | 'master-ecole'
  | 'doctorat'
  | 'classe-prepa';

export interface SituationDetails {
  classe?: 'seconde' | 'premiere' | 'terminale';
  filiere?: 'general' | 'techno' | 'pro';
  specialites?: string[];
  serieTechno?: string;
  filiereProLibre?: string;
  typeBacPlus2?: 'bts' | 'but';
  specialiteBacPlus2?: string;
  specialiteBacPlus2Libre?: string;
  typeCursus?: TypeCursus;
  niveauCursus?: string;
  masterSpecialite?: string;
  typeContratAlternance?: 'apprentissage' | 'professionnalisation';
  secteurActivite?: string;
}

export const EMPTY_SITUATION_DETAILS: SituationDetails = {};
