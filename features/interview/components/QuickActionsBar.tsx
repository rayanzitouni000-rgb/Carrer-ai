import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { OutlineButton, PrimaryButton, Text, useTheme } from '@/design-system';

interface QuickActionsBarProps {
  onStartPractice: () => void;
}

export function QuickActionsBar({ onStartPractice }: QuickActionsBarProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(520).duration(500).springify()} style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Quick Actions
      </Text>
      <View style={styles.row}>
        <PrimaryButton label="Start Practice" size="sm" onPress={onStartPractice} style={styles.btn} />
        <OutlineButton label="Generate Questions" size="sm" style={styles.btn} />
      </View>
      <View style={styles.row}>
        <OutlineButton label="Interview History" size="sm" style={styles.btn} />
        <OutlineButton label="Analyze My Answers" size="sm" style={styles.btn} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1 },
});
