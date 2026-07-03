import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { LoadingSpinner, Text, useTheme } from '@/design-system';
import { resolveBootstrapRoute } from '@/services/bootstrap';

export default function SplashScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1800));
        const route = await resolveBootstrapRoute();
        if (mounted) {
          router.replace(route);
        }
      } catch {
        if (mounted) {
          router.replace('/onboarding');
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <LinearGradient
      colors={['#0A0E17', '#0F172A', '#0A0E17']}
      style={styles.container}
    >
      <View style={styles.content}>
        <AiCharacterAvatar state="idle" size="large" />

        <View style={styles.textBlock}>
          <Text variant="h1" color={theme.colors.text.primary} align="center">
            CareerPilot AI
          </Text>
          <Text variant="body" color={theme.colors.text.secondary} align="center">
            Votre copilote de carrière intelligent
          </Text>
        </View>

        <LoadingSpinner message="Chargement..." />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  textBlock: {
    gap: 8,
    alignItems: 'center',
  },
});
