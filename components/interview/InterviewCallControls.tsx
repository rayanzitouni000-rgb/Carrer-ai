import { StyleSheet, View } from 'react-native';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

interface InterviewCallControlsProps {
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onHangUp: () => void;
  onTogglePause: () => void;
}

export function InterviewCallControls({
  isMuted,
  isPaused,
  onToggleMute,
  onHangUp,
  onTogglePause,
}: InterviewCallControlsProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { borderTopColor: theme.colors.border.subtle }]}>
      <ControlButton
        icon={isMuted ? 'mic-off-outline' : 'mic-outline'}
        label="Muet"
        onPress={onToggleMute}
        active={isMuted}
      />
      <ControlButton
        icon="call"
        label="Raccrocher"
        onPress={onHangUp}
        variant="danger"
      />
      <ControlButton
        icon={isPaused ? 'play-outline' : 'pause-outline'}
        label={isPaused ? 'Reprendre' : 'Pause'}
        onPress={onTogglePause}
        active={isPaused}
      />
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
  variant = 'default',
  active = false,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  active?: boolean;
}) {
  const theme = useTheme();
  const isDanger = variant === 'danger';

  return (
    <PressableScale scale={0.92} onPress={onPress}>
      <View style={styles.btnCol}>
        <View
          style={[
            styles.btnCircle,
            {
              backgroundColor: isDanger
                ? theme.colors.status.danger
                : active
                  ? theme.colors.brand.primary
                  : theme.colors.card.elevated,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <Icon
            name={icon}
            size="md"
            color={isDanger || active ? '#FFFFFF' : theme.colors.text.primary}
          />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    paddingBottom: 8,
  },
  btnCol: {
    alignItems: 'center',
    gap: 8,
    minWidth: 72,
  },
  btnCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
