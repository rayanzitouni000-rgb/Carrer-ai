import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icon, OutlineButton, PressableScale, PrimaryButton, Text, useTheme } from '@/design-system';

import { QUICK_ACTIONS } from '../constants/mockData';

interface QuickActionsSectionProps {
  onAnalyzeAgain?: () => void;
}

export function QuickActionsSection({ onAnalyzeAgain }: QuickActionsSectionProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(480).duration(500).springify()} style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Quick Actions
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {QUICK_ACTIONS.map((action) => (
          <PressableScale
            key={action.id}
            scale={0.95}
            onPress={() => router.push(action.route as never)}
          >
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: theme.colors.card.elevated,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.full,
                },
              ]}
            >
              <Icon name={action.icon} size="xs" color={theme.colors.brand.primaryLight} />
              <Text variant="caption" color={theme.colors.text.primary} style={styles.chipText}>
                {action.label}
              </Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
      <View style={styles.buttons}>
        <PrimaryButton label="Optimize CV" size="sm" onPress={() => router.push('/ai-chat')} style={styles.btn} />
        <OutlineButton label="Analyze Again" size="sm" style={styles.btn} onPress={onAnalyzeAgain} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  scroll: { gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipText: { fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1 },
});
