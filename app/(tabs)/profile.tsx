import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { RankBadge } from '@/components/gamification';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { MOCK_USER, PROFILE_MENU } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useCareerScore } from '@/hooks/useCareerScore';

export default function ProfileScreen() {
  const router = useRouter();
  const { rank } = useCareerScore();

  return (
    <ScreenLayout title="Profil" scrollable safeAreaBottom={false}>
      <Card variant="elevated" style={styles.profileCard}>
        <Avatar name={MOCK_USER.name} size="xl" />
        <RankBadge rank={rank} size="medium" />
        <Text style={styles.name}>{MOCK_USER.name}</Text>
        <Text style={styles.email}>{MOCK_USER.email}</Text>
        <Text style={styles.title}>{MOCK_USER.title}</Text>
        <Badge label="Plan Gratuit" variant="default" />
        <Button
          title="Passer à Premium"
          variant="outline"
          size="sm"
          onPress={() => router.push('/premium')}
          style={styles.premiumButton}
        />
      </Card>

      <View style={styles.menu}>
        {PROFILE_MENU.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(item.route as never)}
          >
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
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  premiumButton: {
    marginTop: spacing.sm,
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
