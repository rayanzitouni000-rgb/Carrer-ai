import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface PlaceholderContentProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PlaceholderContent({
  icon,
  title,
  description,
  children,
}: PlaceholderContentProps) {
  return (
    <View style={styles.container}>
      <Card variant="elevated" style={styles.hero}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Card>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
