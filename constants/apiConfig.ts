import Constants from 'expo-constants';

/** URL du backend Next.js (ex: http://192.168.1.43:3000). Vide = mock local. */
export function getJobApiBaseUrl(): string | null {
  const fromExtra = Constants.expoConfig?.extra?.jobApiUrl;
  const fromEnv = process.env.EXPO_PUBLIC_JOB_API_URL;
  const url = (typeof fromExtra === 'string' ? fromExtra : fromEnv)?.trim();
  return url || null;
}

export function isJobApiConfigured(): boolean {
  return getJobApiBaseUrl() !== null;
}
