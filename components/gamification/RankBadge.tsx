import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CircularProgress, Text, useTheme } from '@/design-system';
import type { RankInfo } from '@/types/rank';

export interface RankBadgeProps {
  rank: RankInfo;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  streakDays?: number;
}

const SIZE_CONFIG = {
  small: { icon: 18, label: 'caption' as const, ring: 44, stroke: 3 },
  medium: { icon: 24, label: 'label' as const, ring: 56, stroke: 4 },
  large: { icon: 32, label: 'title' as const, ring: 72, stroke: 5 },
};

export function RankBadge({
  rank,
  size = 'medium',
  showProgress = false,
  streakDays,
}: RankBadgeProps) {
  const theme = useTheme();
  const config = SIZE_CONFIG[size];
  const isChampion = rank.tier === 'champion';

  const badgeContent = (
    <View style={styles.row}>
      {showProgress ? (
        <CircularProgress
          progress={Math.round(rank.progressToNextRank * 100)}
          size={config.ring}
          strokeWidth={config.stroke}
          color={rank.color}
          trackColor="rgba(255,255,255,0.12)"
          showLabel={false}
        />
      ) : null}

      <View style={[styles.badgeBody, showProgress && styles.badgeWithRing]}>
        <Text style={{ fontSize: config.icon }}>{rank.icon}</Text>
        <Text variant={config.label} color={rank.color}>
          {rank.label}
        </Text>
        {streakDays != null && streakDays > 0 ? (
          <Text variant="caption" color={theme.colors.text.secondary}>
            🔥 {streakDays} jour{streakDays > 1 ? 's' : ''}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (isChampion) {
    return (
      <LinearGradient
        colors={['#7F1D1D', '#B45309', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.championWrap, { borderRadius: theme.radius.lg }]}
      >
        {badgeContent}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: `${rank.color}55`,
          backgroundColor: `${rank.color}14`,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {badgeContent}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  championWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeBody: {
    gap: 2,
  },
  badgeWithRing: {
    paddingLeft: 2,
  },
});
