import Constants from 'expo-constants';

const PRODUCTION_API_URL = 'https://careerpilot-backend-xi.vercel.app';

/** URL du backend Next.js (IA + offres d'emploi). */
export function getApiBaseUrl(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const fromExtra = Constants.expoConfig?.extra?.apiBaseUrl;
  const fromJobExtra = Constants.expoConfig?.extra?.jobApiUrl;
  const url = (typeof fromExtra === 'string' ? fromExtra : fromEnv)?.trim()
    || (typeof fromJobExtra === 'string' ? fromJobExtra : process.env.EXPO_PUBLIC_JOB_API_URL)?.trim();
  return url || null;
}

/** @deprecated Préférer getApiBaseUrl — conservé pour compatibilité job-search. */
export function getJobApiBaseUrl(): string | null {
  return getApiBaseUrl();
}

export function isJobApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

export function isAiApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

export const QUOTA_EXCEEDED_MESSAGE =
  'Limite gratuite atteinte pour aujourd’hui. Passe Premium pour continuer, ou réessaie demain.';
