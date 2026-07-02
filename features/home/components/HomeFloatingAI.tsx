import { Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AiCharacterAvatar } from '@/components/aiCharacter';
import { PressableScale } from '@/design-system';

const FAB_BOTTOM = Platform.OS === 'ios' ? 100 : 82;

export function HomeFloatingAI() {
  const router = useRouter();

  return (
    <PressableScale
      scale={0.94}
      onPress={() => router.push('/(tabs)/ai-chat')}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel="Ouvrir le coach IA carrière"
    >
      <AiCharacterAvatar state="idle" size="small" />
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
});
