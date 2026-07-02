import { useCallback, useEffect, useState } from 'react';

import type { CareerProfile } from '@/features/career-onboarding/types';
import { careerProfileStore } from '@/services/careerProfileStore';
import { authService } from '@/services/authService';

export interface UseProfileDisplayReturn {
  displayName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  isReady: boolean;
}

export function useProfileDisplay(): UseProfileDisplayReturn {
  const [profile, setProfile] = useState<CareerProfile>(careerProfileStore.get());
  const [email, setEmail] = useState('');
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const [storedProfile, account] = await Promise.all([
      careerProfileStore.hydrate(),
      authService.getCurrentAccount(),
    ]);
    setProfile(storedProfile);
    setEmail(account?.email ?? '');
    setIsReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const trimmedFirstName = profile.firstName.trim();
  const displayName = trimmedFirstName || 'Utilisateur';
  const fullName = displayName;
  const jobTitle = profile.targetRoles[0]?.trim() || 'Mon objectif carrière';

  return {
    displayName,
    fullName,
    jobTitle,
    email: email || 'Complète ton inscription pour ajouter ton email',
    isReady,
  };
}
