import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';

const PREMIUM_FEATURES = [
  { icon: 'infinite-outline', title: 'Coach IA illimité', description: 'Conversations sans limite avec votre coach' },
  { icon: 'document-text-outline', title: 'Analyses CV avancées', description: 'Analyses détaillées et comparatives' },
  { icon: 'mic-outline', title: 'Simulateur d\'entretien Pro', description: 'Feedback vocal et scoring avancé' },
  { icon: 'analytics-outline', title: 'Statistiques avancées', description: 'Tableaux de bord et insights carrière' },
];

export default function PremiumScreen() {
  const router = useRouter();

  return (
    <ScreenLayout showBack scrollable>
      <LinearGradient colors={[...colors.gradient.premium]} style={styles.hero}>
        <Ionicons name="diamond" size={48} color={colors.textPrimary} />
        <Text style={styles.heroTitle}>CareerPilot Premium</Text>
        <Text style={styles.heroSubtitle}>
          Débloquez tout le potentiel de votre carrière
        </Text>
        <Text style={styles.price}>9,99 € / mois</Text>
      </LinearGradient>

      <View style={styles.features}>
        {PREMIUM_FEATURES.map((feature) => (
          <Card key={feature.title} variant="elevated">
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={colors.warning}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Button title="S'abonner (mock)" fullWidth />
      <Button title="Plus tard" variant="ghost" fullWidth onPress={() => router.back()} />

      <Text style={styles.disclaimer}>
        Aucun paiement réel — fonctionnalité à implémenter.
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: spacing['2xl'],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  price: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  features: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: spacing.xs,
  },
  featureTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
