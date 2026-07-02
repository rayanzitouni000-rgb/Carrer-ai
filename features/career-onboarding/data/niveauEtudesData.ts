import { BookOpen, GraduationCap, Handshake, Award } from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';

export const NIVEAUX_ETUDES: SelectOption[] = [
  { id: 'l1', label: 'Licence 1 (L1)', icon: GraduationCap },
  { id: 'l2', label: 'Licence 2 (L2)', icon: GraduationCap },
  { id: 'l3', label: 'Licence 3 (L3)', icon: GraduationCap },
  { id: 'm1', label: 'Master 1 (M1)', icon: GraduationCap },
  { id: 'm2', label: 'Master 2 (M2)', icon: GraduationCap },
  { id: 'doctorat-en-cours', label: 'Doctorat', icon: Award },
  { id: 'classe-prepa', label: 'Classe préparatoire', icon: BookOpen },
];

export const NIVEAUX_GRANDE_ECOLE: SelectOption[] = [
  { id: 'bachelor1', label: 'Bachelor 1', icon: GraduationCap },
  { id: 'bachelor2', label: 'Bachelor 2', icon: GraduationCap },
  { id: 'bachelor3', label: 'Bachelor 3', icon: GraduationCap },
  { id: 'master1-ecole', label: 'Master 1', icon: GraduationCap },
  { id: 'master2-ecole', label: 'Master 2', icon: GraduationCap },
];

export const TYPES_CONTRAT_ALTERNANCE: SelectOption[] = [
  { id: 'apprentissage', label: "Contrat d'apprentissage", icon: Handshake },
  {
    id: 'professionnalisation',
    label: 'Contrat de professionnalisation',
    icon: Handshake,
  },
];
