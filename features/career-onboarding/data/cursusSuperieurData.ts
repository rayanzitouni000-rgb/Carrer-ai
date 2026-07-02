import { Award, BookOpen, GraduationCap, Handshake } from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';

export const TYPES_CURSUS: SelectOption[] = [
  { id: 'licence-univ', label: 'Licence (Université)', icon: GraduationCap },
  { id: 'bachelor-ecole', label: 'Bachelor (École)', icon: Award },
  { id: 'master-univ', label: 'Master (Université)', icon: GraduationCap },
  {
    id: 'master-ecole',
    label: 'Master (École de commerce/spécialisée)',
    icon: Award,
  },
  { id: 'doctorat', label: 'Doctorat', icon: Award },
  { id: 'classe-prepa', label: 'Classe préparatoire', icon: BookOpen },
];

export const NIVEAUX_LICENCE: SelectOption[] = [
  { id: 'l1', label: 'Licence 1 (L1)', icon: GraduationCap },
  { id: 'l2', label: 'Licence 2 (L2)', icon: GraduationCap },
  { id: 'l3', label: 'Licence 3 (L3)', icon: GraduationCap },
];

export const NIVEAUX_BACHELOR: SelectOption[] = [
  { id: 'bachelor1', label: 'Bachelor 1', icon: GraduationCap },
  { id: 'bachelor2', label: 'Bachelor 2', icon: GraduationCap },
  { id: 'bachelor3', label: 'Bachelor 3', icon: GraduationCap },
];

export const NIVEAUX_MASTER: SelectOption[] = [
  { id: 'm1', label: 'Master 1 (M1)', icon: GraduationCap },
  { id: 'm2', label: 'Master 2 (M2)', icon: GraduationCap },
];

export const TYPES_CONTRAT_ALTERNANCE: SelectOption[] = [
  { id: 'apprentissage', label: "Contrat d'apprentissage", icon: Handshake },
  {
    id: 'professionnalisation',
    label: 'Contrat de professionnalisation',
    icon: Handshake,
  },
];

export function getNiveauOptionsForCursus(typeCursus?: string): SelectOption[] | null {
  switch (typeCursus) {
    case 'licence-univ':
      return NIVEAUX_LICENCE;
    case 'bachelor-ecole':
      return NIVEAUX_BACHELOR;
    case 'master-univ':
    case 'master-ecole':
      return NIVEAUX_MASTER;
    default:
      return null;
  }
}

export function cursusRequiresNiveau(typeCursus?: string): boolean {
  return (
    Boolean(typeCursus) && typeCursus !== 'doctorat' && typeCursus !== 'classe-prepa'
  );
}

export function isMasterNiveauCursus(niveauCursus?: string): boolean {
  return niveauCursus === 'm1' || niveauCursus === 'm2';
}

export function getCursusLabel(id: string | undefined): string {
  if (!id) return '';
  return TYPES_CURSUS.find((option) => option.id === id)?.label ?? id;
}

export function getNiveauCursusLabel(typeCursus: string | undefined, niveauId: string | undefined): string {
  if (!niveauId) return '';
  const options = getNiveauOptionsForCursus(typeCursus) ?? [];
  return options.find((option) => option.id === niveauId)?.label ?? niveauId;
}
