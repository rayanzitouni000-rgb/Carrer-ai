import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { LoadingSpinner } from '@/design-system';
import { resolveBootstrapRoute } from '@/services/bootstrap';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function SplashScreen() {
  const router = useRouter();

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
    <LinearGradient colors={[...colors.gradient.surface]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LinearGradient colors={[...colors.gradient.primary]} style={styles.logo}>
            <Ionicons name="airplane" size={48} color={colors.textPrimary} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>CareerPilot AI</Text>
        <Text style={styles.subtitle}>Votre copilote de carrière intelligent</Text>
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
    gap: spacing.lg,
    paddingHorizontal: spacing['2xl'],
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
});
