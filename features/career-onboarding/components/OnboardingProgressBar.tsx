import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { LinearProgress, Text, useTheme } from '@/design-system';

interface OnboardingProgressBarProps {
  progress: number;
  stepLabel: string;
}

export function OnboardingProgressBar({ progress, stepLabel }: OnboardingProgressBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text variant="caption" color={theme.colors.text.muted}>
          {stepLabel}
        </Text>
        <Text variant="caption" color={theme.colors.brand.primary}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <LinearProgress
        progress={progress * 100}
        height={4}
        color={theme.colors.brand.primary}
      />
    </View>
  );
}

interface StepTransitionProps {
  stepKey: string;
  children: ReactNode;
}

export function StepTransition({ children }: StepTransitionProps) {
  return <View style={styles.step}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  step: {
    flex: 1,
  },
});
