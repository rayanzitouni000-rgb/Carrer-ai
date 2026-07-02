import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, useTheme } from '@/design-system';

export function InterviewHeader() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.container}>
      <Text variant="h2" color={theme.colors.text.primary}>
        Entretien
      </Text>
      <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.subtitle}>
        Simule tes entretiens avec ton coach IA carrière.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  subtitle: { lineHeight: 22 },
});
