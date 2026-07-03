import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  AnimatedAIOrb,
  Avatar,
  OutlineButton,
  PressableScale,
  SecondaryButton,
  Text,
  usePulseAnimation,
  useTheme,
} from '@/design-system';

import { LIVE_DIALOGUE, RECRUITER } from '../constants/mockData';

interface LiveInterviewPreviewProps {
  isLive: boolean;
  timer: string;
  onEnd: () => void;
}

export function LiveInterviewPreview({ isLive, timer, onEnd }: LiveInterviewPreviewProps) {
  const theme = useTheme();
  const micPulse = usePulseAnimation(0.94, 1.06);

  return (
    <Animated.View entering={FadeInDown.delay(180).duration(500).springify()}>
      <View style={styles.section}>
        <Text variant="title" color={theme.colors.text.primary}>
          Live Interview
        </Text>

        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card.default,
              borderColor: isLive ? theme.colors.brand.primary : theme.colors.border.subtle,
              borderRadius: theme.radius.xl,
            },
            isLive && theme.shadows.glow,
          ]}
        >
          {/* Recruiter header */}
          <View style={styles.recruiterRow}>
            <AnimatedAIOrb size={44} />
            <View style={styles.recruiterInfo}>
              <Text variant="label" color={theme.colors.text.primary}>
                {RECRUITER.name}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {RECRUITER.title}
              </Text>
              <View style={styles.statusRow}>
                <View style={[styles.onlineDot, { backgroundColor: theme.colors.status.success }]} />
                <Text variant="caption" color={theme.colors.status.success}>
                  Online
                </Text>
              </View>
            </View>
            <View style={[styles.timer, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
              <Text variant="label" color={theme.colors.brand.primaryLight}>
                {timer}
              </Text>
            </View>
          </View>

          {/* Dialogue */}
          <View style={styles.messages}>
            {LIVE_DIALOGUE.map((msg) => {
              const isRecruiter = msg.role === 'recruiter';
              return (
                <View
                  key={msg.id}
                  style={[styles.msgRow, !isRecruiter && styles.msgRowCandidate]}
                >
                  {isRecruiter && <Avatar name={RECRUITER.name} size="xs" />}
                  {isRecruiter ? (
                    <View
                      style={[
                        styles.bubble,
                        {
                          backgroundColor: theme.colors.card.elevated,
                          borderColor: theme.colors.border.subtle,
                          borderRadius: theme.radius.lg,
                          borderBottomLeftRadius: theme.radius.xs,
                        },
                      ]}
                    >
                      <Text variant="bodySmall" color={theme.colors.text.primary} style={styles.msgText}>
                        {msg.content}
                      </Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={[...theme.colors.brand.gradient]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.bubble, styles.userBubble, { borderBottomRightRadius: theme.radius.xs }]}
                    >
                      <Text variant="bodySmall" color="#FFFFFF" style={styles.msgText}>
                        {msg.content}
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              );
            })}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Animated.View style={micPulse}>
              <PressableScale scale={0.94}>
                <LinearGradient
                  colors={[...theme.colors.brand.gradient]}
                  style={[styles.micBtn, theme.shadows.glow, { borderRadius: theme.radius.full }]}
                >
                  <Text style={styles.micIcon}>🎙</Text>
                </LinearGradient>
              </PressableScale>
            </Animated.View>
            <Text variant="caption" color={theme.colors.text.muted} align="center">
              Tap to speak (UI preview)
            </Text>

            <View style={styles.actionRow}>
              <OutlineButton label="Skip Question" size="sm" style={styles.actionBtn} />
              <SecondaryButton label="Next Question" size="sm" style={styles.actionBtn} />
            </View>
            <OutlineButton label="End Interview" size="sm" fullWidth onPress={onEnd} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  container: {
    borderWidth: 1,
    padding: 16,
    gap: 16,
    overflow: 'hidden',
  },
  recruiterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recruiterInfo: { flex: 1, gap: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  timer: { paddingHorizontal: 12, paddingVertical: 6 },
  messages: { gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowCandidate: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  userBubble: { borderRadius: 16 },
  msgText: { lineHeight: 20 },
  controls: { alignItems: 'center', gap: 10, marginTop: 4 },
  micBtn: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { fontSize: 28 },
  actionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  actionBtn: { flex: 1 },
});
