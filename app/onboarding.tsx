import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { ONBOARDING_SLIDES } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[currentIndex];
  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace('/career-onboarding');
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    router.replace('/career-onboarding');
  };

  return (
    <ScreenLayout scrollable={false} safeAreaBottom>
      <View style={styles.container}>
        <View style={styles.skipRow}>
          <Button title="Passer" variant="ghost" size="sm" onPress={handleSkip} />
        </View>

        <View style={styles.slide}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={slide.icon as keyof typeof Ionicons.glyphMap}
              size={64}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
          <Button
            title={isLast ? 'Commencer' : 'Suivant'}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing['2xl'],
  },
  skipRow: {
    alignItems: 'flex-end',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    maxWidth: width - spacing['3xl'],
    alignSelf: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    gap: spacing['2xl'],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceHighlight,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
