import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { useTheme } from '../../theme';
import { IconName } from '../../tokens';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" color={theme.colors.text.secondary}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: error ? theme.colors.status.danger : theme.colors.border.default,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        {leftIcon && <Icon name={leftIcon} size="sm" color={theme.colors.text.muted} />}
        <TextInput
          placeholderTextColor={theme.colors.text.muted}
          style={[
            theme.typography.body,
            styles.input,
            { color: theme.colors.text.primary },
            style,
          ]}
          {...props}
        />
        {rightIcon && (
          <Icon name={rightIcon} size="sm" color={theme.colors.text.muted} />
        )}
      </View>
      {error && (
        <Text variant="caption" color={theme.colors.status.danger}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text variant="caption" color={theme.colors.text.muted}>
          {hint}
        </Text>
      )}
    </View>
  );
}

export function SearchInput({ placeholder = 'Rechercher...', ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.searchField,
        {
          backgroundColor: theme.colors.card.default,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.full,
        },
      ]}
    >
      <Icon name="search-outline" size="sm" color={theme.colors.text.muted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
        style={[theme.typography.body, styles.searchInput, { color: theme.colors.text.primary }]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
});
