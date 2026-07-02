export interface JobOffer {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  contractType: string;
  isRemote: boolean;
  remoteLabel?: string;
  publishedDate: string;
  description: string;
  requiredSkills: string[];
  matchScore: number;
  sourceUrl?: string;
}

export interface JobSearchFilters {
  query: string;
  contractTypes: string[];
  location: string;
  radius: number;
  remoteOnly: boolean;
  minSalary?: number;
  datePosted: 'today' | 'week' | 'month' | 'all';
}

export interface JobSearchPreferences {
  location: string;
  locationLabel: string;
  radius: number;
  hasBeenSet: boolean;
}

export interface SavedJob {
  jobOffer: JobOffer;
  savedAt: string;
}

export const CONTRACT_TYPE_OPTIONS = [
  'CDI',
  'CDD',
  'Stage',
  'Alternance',
  'Freelance',
  'Intérim',
  'Temps partiel',
] as const;

export const DEFAULT_JOB_SEARCH_PREFERENCES: JobSearchPreferences = {
  location: '',
  locationLabel: '',
  radius: 50,
  hasBeenSet: false,
};

export const DATE_POSTED_OPTIONS: { id: JobSearchFilters['datePosted']; label: string }[] = [
  { id: 'today', label: '24h' },
  { id: 'week', label: '7 jours' },
  { id: 'month', label: '30 jours' },
  { id: 'all', label: 'Tout' },
];

export const RADIUS_OPTIONS = [
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
  { value: 9999, label: 'France entière' },
] as const;

export const DEFAULT_JOB_SEARCH_FILTERS: JobSearchFilters = {
  query: '',
  contractTypes: [],
  location: '',
  radius: 50,
  remoteOnly: false,
  minSalary: undefined,
  datePosted: 'all',
};
