import { useCallback, useEffect, useState } from 'react';

import type { CareerProfile } from '@/features/career-onboarding/types';
import { careerProfileStore } from '@/services/careerProfileStore';
import { useAuth } from '@/hooks/useAuth';

export interface UseProfileDisplayReturn {
  displayName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  isReady: boolean;
}

export function useProfileDisplay(): UseProfileDisplayReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CareerProfile>(careerProfileStore.get());
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const storedProfile = await careerProfileStore.hydrate();
    setProfile(storedProfile);
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
    email: user?.email || 'Connecte-toi pour afficher ton email',
    isReady,
  };
}
