import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { resetCareerOnboarding } from '@/services/resetCareerOnboarding';

interface UseResetCareerProfileOptions {
  /** Route après reset (défaut : début onboarding carrière). */
  redirectTo?: '/career-onboarding' | '/onboarding';
  clearSession?: boolean;
  onReset?: () => void;
}

export function useResetCareerProfile({
  redirectTo = '/career-onboarding',
  clearSession = false,
  onReset,
}: UseResetCareerProfileOptions = {}) {
  const router = useRouter();

  const performReset = useCallback(async () => {
    await resetCareerOnboarding({ clearSession });
    onReset?.();
    router.replace(redirectTo);
  }, [clearSession, onReset, redirectTo, router]);

  const confirmReset = useCallback(() => {
    Alert.alert(
      'Réinitialiser le profil ?',
      'Toutes tes réponses (infos perso, formation, compétences…) seront effacées. Tu repartiras du début de l’onboarding.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            void performReset();
          },
        },
      ]
    );
  }, [performReset]);

  return { confirmReset, performReset };
}
