import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

import { CHAT_SMART_ACTIONS } from '../constants/mockData';

export function SmartActions() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(400).springify()} style={styles.section}>
      <Text variant="caption" color={theme.colors.text.muted} style={styles.label}>
        SMART ACTIONS
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CHAT_SMART_ACTIONS.map((action) => (
          <PressableScale
            key={action.id}
            scale={0.95}
            onPress={() => router.push(action.route as never)}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.card.default,
                  borderColor: theme.colors.border.subtle,
                  borderRadius: theme.radius.lg,
                },
              ]}
            >
              <LinearGradient
                colors={[...action.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.iconWrap, { borderRadius: theme.radius.sm }]}
              >
                <Icon name={action.icon} size="sm" color="#FFFFFF" />
              </LinearGradient>
              <Text variant="caption" color={theme.colors.text.secondary} style={styles.actionLabel}>
                {action.label}
              </Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  label: {
    letterSpacing: 1,
    fontWeight: '600',
  },
  scroll: { gap: 10 },
  card: {
    width: 88,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});
