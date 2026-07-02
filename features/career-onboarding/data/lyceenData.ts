import {
  Atom,
  BookOpen,
  Briefcase,
  Calculator,
  Code,
  Cog,
  Dumbbell,
  FlaskConical,
  Globe,
  Languages,
  Leaf,
  Music,
  Palette,
  School,
  TrendingUp,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';

export const CLASSES_LYCEE: SelectOption[] = [
  { id: 'seconde', label: 'Seconde', icon: School },
  { id: 'premiere', label: 'Première', icon: School },
  { id: 'terminale', label: 'Terminale', icon: School },
];

export const FILIERES_BAC: SelectOption[] = [
  { id: 'general', label: 'Bac Général', icon: BookOpen },
  { id: 'techno', label: 'Bac Technologique', icon: Cog },
  { id: 'pro', label: 'Bac Professionnel', icon: Wrench },
];

export const SPECIALITES_BAC_GENERAL: SelectOption[] = [
  { id: 'maths', label: 'Mathématiques', icon: Calculator },
  { id: 'physique-chimie', label: 'Physique-Chimie', icon: Atom },
  { id: 'svt', label: 'SVT', icon: Leaf },
  { id: 'ses', label: 'Sciences Économiques et Sociales', icon: TrendingUp },
  { id: 'hggsp', label: 'Histoire-Géo, Géopolitique, Sciences Po', icon: Globe },
  { id: 'llce', label: 'Langues, Littératures et Cultures Étrangères', icon: Languages },
  {
    id: 'llca',
    label: "Littérature et Langues et Cultures de l'Antiquité",
    icon: BookOpen,
  },
  { id: 'nsi', label: 'Numérique et Sciences Informatiques', icon: Code },
  { id: 'arts', label: 'Arts', icon: Palette },
  {
    id: 'eppcs',
    label: 'Éducation Physique, Pratiques et Culture Sportive',
    icon: Dumbbell,
  },
  { id: 'si', label: "Sciences de l'Ingénieur", icon: Cog },
  { id: 'bio-eco', label: 'Biologie-Écologie', icon: Leaf },
];

export const SERIES_TECHNO: SelectOption[] = [
  { id: 'stmg', label: 'STMG (Management/Gestion)', icon: Briefcase },
  { id: 'sti2d', label: 'STI2D (Industrie/Développement Durable)', icon: Cog },
  { id: 'st2s', label: 'ST2S (Santé/Social)', icon: Leaf },
  { id: 'stl', label: 'STL (Laboratoire)', icon: FlaskConical },
  { id: 'std2a', label: 'STD2A (Design/Arts Appliqués)', icon: Palette },
  { id: 'sthr', label: 'STHR (Hôtellerie/Restauration)', icon: UtensilsCrossed },
  { id: 's2tmd', label: 'S2TMD (Techniques Musique/Danse)', icon: Music },
  { id: 'stav', label: 'STAV (Agronomie/Vivant)', icon: Leaf },
];
