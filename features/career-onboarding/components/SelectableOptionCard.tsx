import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

interface SelectableOptionCardProps {
  label: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableOptionCard({
  label,
  description,
  emoji,
  selected,
  onPress,
}: SelectableOptionCardProps) {
  const theme = useTheme();

  return (
    <PressableScale onPress={onPress} scale={0.98}>
      <View
        style={[
          styles.card,
          {
            borderRadius: theme.radius.lg,
            borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
            backgroundColor: selected
              ? 'rgba(43, 108, 255, 0.12)'
              : theme.colors.card.default,
          },
          selected && theme.shadows.sm,
        ]}
      >
        {selected && (
          <LinearGradient
            colors={['rgba(59,130,246,0.2)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.lg }]}
          />
        )}
        <View style={styles.row}>
          {emoji ? (
            <Text variant="h3">{emoji}</Text>
          ) : (
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: selected
                    ? theme.colors.brand.primary
                    : theme.colors.card.elevated,
                },
              ]}
            />
          )}
          <View style={styles.text}>
            <Text
              variant="label"
              color={selected ? theme.colors.text.primary : theme.colors.text.secondary}
            >
              {label}
            </Text>
            {description && (
              <Text variant="caption" color={theme.colors.text.muted}>
                {description}
              </Text>
            )}
          </View>
          {selected && (
            <Icon name="checkmark-circle-outline" size="md" color={theme.colors.brand.primary} />
          )}
        </View>
      </View>
    </PressableScale>
  );
}

interface ChipSelectorProps<T extends string> {
  options: { id: T; label: string }[];
  selected: T | T[] | null;
  multi?: boolean;
  onSelect: (id: T) => void;
}

export function ChipSelector<T extends string>({
  options,
  selected,
  multi = false,
  onSelect,
}: ChipSelectorProps<T>) {
  const theme = useTheme();

  const isSelected = (id: T) => {
    if (multi && Array.isArray(selected)) return selected.includes(id);
    return selected === id;
  };

  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = isSelected(option.id);
        return (
          <PressableScale key={option.id} onPress={() => onSelect(option.id)} scale={0.95}>
            <View
              style={[
                styles.chip,
                {
                  borderRadius: theme.radius.full,
                  borderColor: active ? theme.colors.brand.primary : theme.colors.border.subtle,
                  backgroundColor: active
                    ? 'rgba(43, 108, 255, 0.15)'
                    : theme.colors.card.elevated,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: active ? theme.colors.brand.primary : theme.colors.text.secondary,
                  },
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
  },
});
