import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';
import { AiCharacterAvatar } from '@/components/aiCharacter';

export function ChatHeader() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <AiCharacterAvatar state="idle" size="small" />
        <View style={styles.titles}>
          <Text variant="title" color={theme.colors.text.primary}>
            Coach IA
          </Text>
          <Text variant="caption" color={theme.colors.status.success}>
            En ligne
          </Text>
        </View>
      </View>

      <PressableScale scale={0.92} onPress={() => router.back()} accessibilityLabel="Fermer le chat">
        <View
          style={[
            styles.closeBtn,
            { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full },
          ]}
        >
          <Icon name="close" size="sm" color={theme.colors.text.primary} />
        </View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  titles: {
    gap: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
