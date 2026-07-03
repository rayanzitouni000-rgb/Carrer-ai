import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

export interface OptionItem {
  id: string;
  label: string;
  emoji?: string;
}

interface OptionCardGridProps {
  options: OptionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  columns?: number;
}

export function OptionCardGrid({
  options,
  selectedId,
  onSelect,
  columns = 2,
}: OptionCardGridProps) {
  const theme = useTheme();
  const itemWidth = columns === 2 ? '48%' : `${100 / columns - 2}%`;

  const handleSelect = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(id);
  };

  return (
    <View style={styles.grid}>
      {options.map((option, index) => {
        const selected = selectedId === option.id;
        const isLastOdd =
          columns === 2 && options.length % 2 !== 0 && index === options.length - 1;
        const width = isLastOdd ? '100%' : itemWidth;

        return (
          <Animated.View
            key={option.id}
            entering={FadeInDown.delay(index * 30).duration(200)}
            style={[styles.item, { width }, isLastOdd && styles.itemFull]}
          >
            <PressableScale onPress={() => handleSelect(option.id)} scale={0.97}>
              <View
                style={[
                  styles.card,
                  {
                    borderRadius: theme.radius.lg,
                    borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                    backgroundColor: selected
                      ? 'rgba(43, 108, 255, 0.12)'
                      : theme.colors.card.default,
                    minHeight: 90,
                  },
                  selected && theme.shadows.sm,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
              >
                {selected && (
                  <LinearGradient
                    colors={['rgba(59,130,246,0.2)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.lg }]}
                  />
                )}

                <View style={styles.content}>
                  {option.emoji ? (
                    <Text variant="h3" style={styles.emoji}>
                      {option.emoji}
                    </Text>
                  ) : (
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: selected
                            ? theme.colors.brand.primary
                            : theme.colors.border.subtle,
                          backgroundColor: selected
                            ? theme.colors.brand.primary
                            : 'transparent',
                        },
                      ]}
                    />
                  )}
                  <Text
                    variant="caption"
                    color={selected ? theme.colors.text.primary : theme.colors.text.secondary}
                    numberOfLines={2}
                    style={styles.label}
                  >
                    {option.label}
                  </Text>
                  {selected && (
                    <Icon
                      name="checkmark-circle-outline"
                      size="sm"
                      color={theme.colors.brand.primary}
                      style={styles.check}
                    />
                  )}
                </View>
              </View>
            </PressableScale>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  item: {
    flexGrow: 0,
  },
  itemFull: {
    flexGrow: 1,
  },
  card: {
    borderWidth: 1.5,
    padding: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 66,
  },
  emoji: {
    textAlign: 'center',
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  check: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
