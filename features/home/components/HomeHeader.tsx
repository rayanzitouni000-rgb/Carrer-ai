import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Icon,
  PressableScale,
  Text,
  useTheme,
} from '@/design-system';
import { useProfileDisplay } from '@/hooks/useProfileDisplay';

import { AnimatedGreeting } from './AnimatedEntrance';
import { useGreeting } from '../hooks';

export function HomeHeader() {
  const theme = useTheme();
  const greeting = useGreeting();
  const { displayName, fullName } = useProfileDisplay();

  return (
    <View style={styles.container}>
      <AnimatedGreeting>
        <View style={styles.textBlock}>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {greeting}
          </Text>
          <Text variant="h2" color={theme.colors.text.primary}>
            {displayName} 👋
          </Text>
        </View>
      </AnimatedGreeting>

      <View style={styles.actions}>
        <PressableScale scale={0.92}>
          <View
            style={[
              styles.iconBtn,
              { backgroundColor: theme.colors.card.default, borderColor: theme.colors.border.subtle },
            ]}
          >
            <Icon name="notifications-outline" size="md" color={theme.colors.text.primary} />
            <View style={[styles.notifDot, { backgroundColor: theme.colors.status.danger }]} />
          </View>
        </PressableScale>
        <Avatar name={fullName} size="md" showOnline />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  textBlock: { gap: 2, flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
