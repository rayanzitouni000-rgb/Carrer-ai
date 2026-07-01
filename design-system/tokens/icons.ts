import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;

export const iconSize = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 48,
} as const;

/** Semantic icon mapping for consistent usage across the app */
export const icons = {
  home: 'home-outline' as IconName,
  jobs: 'briefcase-outline' as IconName,
  ai: 'sparkles-outline' as IconName,
  progress: 'stats-chart-outline' as IconName,
  profile: 'person-outline' as IconName,
  search: 'search-outline' as IconName,
  settings: 'settings-outline' as IconName,
  notification: 'notifications-outline' as IconName,
  premium: 'diamond-outline' as IconName,
  success: 'checkmark-circle-outline' as IconName,
  warning: 'alert-circle-outline' as IconName,
  error: 'close-circle-outline' as IconName,
  info: 'information-circle-outline' as IconName,
  chevronRight: 'chevron-forward' as IconName,
  chevronLeft: 'chevron-back' as IconName,
  close: 'close' as IconName,
  send: 'send' as IconName,
  mic: 'mic-outline' as IconName,
  document: 'document-text-outline' as IconName,
  roadmap: 'map-outline' as IconName,
  company: 'business-outline' as IconName,
  location: 'location-outline' as IconName,
  salary: 'cash-outline' as IconName,
  skill: 'code-slash-outline' as IconName,
  star: 'star' as IconName,
  trending: 'trending-up-outline' as IconName,
  lock: 'lock-closed-outline' as IconName,
  mail: 'mail-outline' as IconName,
  lockKey: 'lock-closed-outline' as IconName,
} as const;
