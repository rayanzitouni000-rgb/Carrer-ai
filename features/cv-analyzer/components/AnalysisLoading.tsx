import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnalysisLoadingProps {
  progress: number;
  currentStep: string;
  fileName?: string | null;
}

export function AnalysisLoading({ progress, currentStep, fileName }: AnalysisLoadingProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <LinearGradient
        colors={['#111827', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderRadius: theme.radius.xl,
            borderColor: 'rgba(43, 108, 255, 0.25)',
          },
        ]}
      >
        <AnimatedAIOrb size={72} />

        <Text variant="title" color={theme.colors.text.primary} align="center">
          Analyzing your CV
        </Text>
        {fileName && (
          <Text variant="caption" color={theme.colors.text.muted} align="center">
            {fileName}
          </Text>
        )}

        <View style={styles.progressWrap}>
          <LinearProgress progress={progress} height={8} showLabel label="Progress" />
        </View>

        <Animated.View key={currentStep} entering={FadeIn.duration(300)}>
          <Text variant="bodySmall" color={theme.colors.brand.primaryLight} align="center" style={styles.step}>
            {currentStep}
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  card: {
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  progressWrap: { width: '100%', marginTop: 8 },
  step: { fontWeight: '600', marginTop: 4 },
});
