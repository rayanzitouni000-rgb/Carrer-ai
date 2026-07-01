import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useShimmerAnimation } from '../../animations';
import { useTheme } from '../../theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius, style }: SkeletonProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const shimmerStyle = useShimmerAnimation(screenWidth);

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          backgroundColor: theme.colors.skeleton.base,
          borderRadius: borderRadius ?? theme.radius.sm,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', theme.colors.skeleton.highlight, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function CardSkeleton({ style }: { style?: ViewStyle }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card.default,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
          padding: theme.spacing['4'],
        },
        style,
      ]}
    >
      <Skeleton width={48} height={48} borderRadius={theme.radius.md} />
      <Skeleton width="70%" height={18} style={{ marginTop: 12 }} />
      <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
      <Skeleton width="85%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

export function LoadingSkeleton() {
  return <ListSkeleton count={4} />;
}

const styles = StyleSheet.create({
  base: {},
  card: { gap: 0, borderWidth: 1 },
  list: { gap: 12 },
});
