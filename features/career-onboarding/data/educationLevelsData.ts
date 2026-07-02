import {
  Award,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Laptop,
  School,
} from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';
import type { EducationLevel } from '../types';

export const EDUCATION_LEVELS: SelectOption[] = [
  { id: 'college', label: 'Collège', icon: School },
  { id: 'cap-bep', label: 'CAP / BEP', icon: School },
  { id: 'bac-general', label: 'Bac (Général)', icon: BookOpen },
  { id: 'bac-techno', label: 'Bac (Techno)', icon: BookOpen },
  { id: 'bac-pro', label: 'Bac (Pro)', icon: BookOpen },
  { id: 'bac-2', label: 'Bac+2 (BTS/DUT/BUT)', icon: GraduationCap },
  { id: 'bac-3', label: 'Bac+3 (Licence)', icon: GraduationCap },
  { id: 'bac-5-master', label: 'Bac+5 (Master)', icon: GraduationCap },
  { id: 'ingenieur', label: "Diplôme d'ingénieur", icon: Award },
  { id: 'commerce-ecole', label: 'Diplôme de commerce (école)', icon: Award },
  { id: 'doctorat', label: 'Doctorat', icon: Award },
  { id: 'autodidacte', label: 'Autodidacte / Formation en ligne', icon: Laptop },
  { id: 'autre', label: 'Autre', icon: HelpCircle },
];

export function getEducationLevelOption(id: EducationLevel | null): SelectOption | undefined {
  if (!id) return undefined;
  return EDUCATION_LEVELS.find((option) => option.id === id);
}
