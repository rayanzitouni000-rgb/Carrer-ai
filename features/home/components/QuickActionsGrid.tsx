import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

import { HOME_QUICK_ACTIONS } from '../constants/mockData';

export function QuickActionsGrid() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary} style={styles.title}>
        Quick Actions
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {HOME_QUICK_ACTIONS.map((action) => (
          <PressableScale
            key={action.id}
            scale={0.95}
            onPress={() => router.push(action.route as never)}
          >
            <View
              style={[
                styles.card,
                theme.shadows.sm,
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
                style={[styles.iconWrap, { borderRadius: theme.radius.md }]}
              >
                <Icon name={action.icon} size="md" color="#FFFFFF" />
              </LinearGradient>
              <Text variant="caption" color={theme.colors.text.secondary} align="center" style={styles.label}>
                {action.label}
              </Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { paddingHorizontal: 0 },
  scroll: { gap: 12, paddingRight: 4 },
  card: {
    width: 100,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '600', lineHeight: 16 },
});
