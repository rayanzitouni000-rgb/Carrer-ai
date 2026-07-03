import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { PressableScale, useTheme } from '@/design-system';

const FAB_SIZE = 70;
const FAB_BOTTOM = Platform.OS === 'ios' ? 108 : 90;

export function HomeFloatingAI() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <PressableScale
      scale={0.94}
      onPress={() => router.push('/ai-chat')}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel="Ouvrir le coach IA carrière"
    >
      <View
        style={[
          styles.button,
          theme.shadows.lg,
          {
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
          },
        ]}
      >
        <AiCharacterAvatar state="idle" size="fab" />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    right: 16,
    zIndex: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
