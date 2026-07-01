import { ReactNode, useEffect } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { duration, spring } from '../../tokens';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapHeight?: number;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapHeight = SCREEN_HEIGHT * 0.55,
}: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(snapHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, spring.gentle);
      backdropOpacity.value = withTiming(1, { duration: duration.normal });
    } else {
      translateY.value = withTiming(snapHeight, { duration: duration.fast });
      backdropOpacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, snapHeight, translateY, backdropOpacity]);

  const close = () => {
    translateY.value = withTiming(snapHeight, { duration: duration.fast }, () => {
      runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: duration.fast });
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 500) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, spring.snappy);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.72,
  }));

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { backgroundColor: theme.colors.overlay }, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              sheetStyle,
              theme.shadows.lg,
              {
                height: snapHeight + insets.bottom,
                paddingBottom: insets.bottom + theme.spacing['4'],
                backgroundColor: theme.colors.card.elevated,
                borderTopLeftRadius: theme.radius['2xl'],
                borderTopRightRadius: theme.radius['2xl'],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: theme.colors.border.default, borderRadius: theme.radius.full }]} />
            {title && (
              <Text variant="title" color={theme.colors.text.primary} style={styles.sheetTitle}>
                {title}
              </Text>
            )}
            <View style={styles.sheetContent}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </RNModal>
  );
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const theme = useTheme();
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, spring.snappy);
      opacity.value = withTiming(1, { duration: duration.normal });
    } else {
      scale.value = withTiming(0.92, { duration: duration.fast });
      opacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, scale, opacity]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.72,
  }));

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { backgroundColor: theme.colors.overlay }, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalCard,
            cardStyle,
            theme.shadows.lg,
            {
              backgroundColor: theme.colors.card.elevated,
              borderColor: theme.colors.border.subtle,
              borderRadius: theme.radius.xl,
              marginHorizontal: theme.spacing['6'],
              padding: theme.spacing['5'],
            },
          ]}
        >
          {title && (
            <Text variant="h3" color={theme.colors.text.primary} style={styles.modalTitle}>
              {title}
            </Text>
          )}
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  handle: { width: 36, height: 4, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { marginBottom: 12 },
  sheetContent: { flex: 1 },
  modalCard: { borderWidth: 1, alignSelf: 'center', width: '100%', maxWidth: 400 },
  modalTitle: { marginBottom: 12 },
});
