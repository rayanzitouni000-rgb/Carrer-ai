import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icon, PressableScale, SkillBadge, Text, usePulseAnimation, useTheme } from '@/design-system';

import { SUPPORTED_FORMATS } from '../constants/mockData';

interface UploadCardProps {
  onUpload: () => void;
  disabled?: boolean;
}

export function UploadCard({ onUpload, disabled }: UploadCardProps) {
  const theme = useTheme();
  const glowStyle = usePulseAnimation(0.96, 1.04);

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
      <PressableScale scale={0.98} onPress={onUpload} disabled={disabled}>
        <View style={styles.wrapper}>
          <Animated.View
            style={[
              styles.glow,
              glowStyle,
              { backgroundColor: 'rgba(43, 108, 255, 0.1)', borderRadius: theme.radius.xl },
            ]}
          />
          <View
            style={[
              styles.card,
              {
                borderColor: 'rgba(43, 108, 255, 0.35)',
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colors.card.default,
              },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.full }]}>
              <Icon name="cloud-upload-outline" size="2xl" color={theme.colors.brand.primaryLight} />
            </View>

            <Text variant="title" color={theme.colors.text.primary}>
              Upload Resume
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.muted} align="center">
              Tap to analyze your CV with AI
            </Text>

            <Text variant="caption" color={theme.colors.text.muted} style={styles.formatsLabel}>
              Supported formats
            </Text>
            <View style={styles.formats}>
              {SUPPORTED_FORMATS.map((format) => (
                <SkillBadge key={format} label={format} variant="primary" />
              ))}
            </View>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glow: {
    position: 'absolute',
    top: 4,
    left: 12,
    right: 12,
    bottom: -4,
  },
  card: {
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  formatsLabel: { marginTop: 8, letterSpacing: 0.5 },
  formats: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
