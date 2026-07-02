import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { RankBadge } from '@/components/gamification';
import { PaywallScreen, PremiumBadge } from '@/components/premium';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { PROFILE_MENU } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useCareerScore } from '@/hooks/useCareerScore';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useProfileDisplay } from '@/hooks/useProfileDisplay';

export default function ProfileScreen() {
  const router = useRouter();
  const { rank } = useCareerScore();
  const { isPremium, simulateTogglePremium } = usePremiumStatus();
  const { displayName, fullName, jobTitle, email } = useProfileDisplay();
  const [paywallVisible, setPaywallVisible] = useState(false);

  return (
    <ScreenLayout title="Profil" scrollable safeAreaBottom={false}>
      <Card variant="elevated" style={styles.profileCard}>
        <Avatar name={fullName} size="xl" />
        <RankBadge rank={rank} size="medium" />
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.title}>{jobTitle}</Text>

        {isPremium ? (
          <>
            <PremiumBadge size="md" />
            <Button
              title="Gérer mon abonnement"
              variant="outline"
              size="sm"
              onPress={() => router.push('/premium/manage' as never)}
              style={styles.premiumButton}
            />
          </>
        ) : (
          <>
            <Badge label="Plan Gratuit" variant="default" />
            <Button
              title="Passer à Premium"
              variant="outline"
              size="sm"
              onPress={() => setPaywallVisible(true)}
              style={styles.premiumButton}
            />
          </>
        )}

        {__DEV__ && (
          <Pressable onPress={() => void simulateTogglePremium()} style={styles.devToggle}>
            <Text style={styles.devToggleText}>🔧 [DEV] Toggle Premium</Text>
          </Pressable>
        )}
      </Card>

      <View style={styles.menu}>
        {PROFILE_MENU.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(item.route as never)}>
            <Card padding="md">
              <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={colors.primary}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="generic"
        onClose={() => setPaywallVisible(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  premiumButton: {
    marginTop: spacing.sm,
  },
  devToggle: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  devToggleText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  menu: {
    gap: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
