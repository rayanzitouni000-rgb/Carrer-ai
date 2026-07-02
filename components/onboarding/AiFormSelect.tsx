import { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Check, ChevronDown, HelpCircle, Search } from 'lucide-react-native';

import { Text, useTheme } from '@/design-system';
import type { SelectOption } from '@/types/onboarding';

const DROPDOWN_ANIM_MS = 250;
const DROPDOWN_MAX_HEIGHT = 280;
const DEFAULT_PLACEHOLDER = 'Sélectionner...';

interface FieldLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AiFormSelectSingleProps {
  mode: 'single';
  label: string;
  placeholder?: string;
  options: SelectOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface AiFormSelectMultiProps {
  mode: 'multi';
  label: string;
  placeholder?: string;
  options: SelectOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelection?: number;
  searchable?: boolean;
  onAddCustom?: (label: string) => void;
}

export type AiFormSelectProps = AiFormSelectSingleProps | AiFormSelectMultiProps;

function resolveIcon(option: SelectOption) {
  return option.icon ?? HelpCircle;
}

interface OptionRowProps {
  option: SelectOption;
  selected: boolean;
  disabled?: boolean;
  mode: 'single' | 'multi';
  onPress: () => void;
}

function OptionRow({ option, selected, disabled, mode, onPress }: OptionRowProps) {
  const theme = useTheme();
  const Icon = resolveIcon(option);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.row,
        selected && { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
        disabled && styles.rowDisabled,
      ]}
      accessibilityRole={mode === 'single' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={option.label}
    >
      <Icon
        size={20}
        color={selected ? theme.colors.brand.primaryLight : theme.colors.text.secondary}
      />
      <Text
        variant="body"
        color={disabled ? theme.colors.text.muted : theme.colors.text.primary}
        style={styles.rowLabel}
        numberOfLines={2}
      >
        {option.label}
      </Text>
      {mode === 'single' && selected ? (
        <Check size={18} color={theme.colors.brand.primaryLight} />
      ) : null}
      {mode === 'multi' ? (
        selected ? (
          <View
            style={[
              styles.checkbox,
              styles.checkboxChecked,
              {
                borderColor: theme.colors.brand.primary,
                backgroundColor: theme.colors.brand.primary,
              },
            ]}
          >
            <Check size={14} color="#FFFFFF" />
          </View>
        ) : (
          <View style={[styles.checkbox, { borderColor: theme.colors.border.subtle }]} />
        )
      ) : null}
    </Pressable>
  );
}

export function AiFormSelect(props: AiFormSelectProps) {
  const theme = useTheme();
  const fieldRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fieldLayout, setFieldLayout] = useState<FieldLayout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const placeholder = props.placeholder ?? DEFAULT_PLACEHOLDER;

  const chevronRotation = useSharedValue(0);
  const dropdownProgress = useSharedValue(0);

  const measureField = (onMeasured?: () => void) => {
    fieldRef.current?.measureInWindow((x, y, width, height) => {
      setFieldLayout({ x, y, width, height });
      onMeasured?.();
    });
  };

  const open = () => {
    measureField(() => {
      setIsOpen(true);
      chevronRotation.value = withTiming(180, { duration: DROPDOWN_ANIM_MS });
      dropdownProgress.value = withTiming(1, {
        duration: DROPDOWN_ANIM_MS,
        easing: Easing.out(Easing.cubic),
      });
    });
  };

  const close = () => {
    setIsOpen(false);
    setFieldLayout(null);
    setSearchQuery('');
    chevronRotation.value = withTiming(0, { duration: DROPDOWN_ANIM_MS });
    dropdownProgress.value = withTiming(0, {
      duration: DROPDOWN_ANIM_MS,
      easing: Easing.in(Easing.cubic),
    });
    Keyboard.dismiss();
  };

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  const filteredOptions = useMemo(() => {
    if (props.mode === 'multi' && props.searchable) {
      const normalized = searchQuery.trim().toLowerCase();
      if (!normalized) return props.options;
      return props.options.filter((option) =>
        option.label.toLowerCase().includes(normalized)
      );
    }
    return props.options;
  }, [props, searchQuery]);

  const selectedSingle =
    props.mode === 'single'
      ? props.options.find((option) => option.id === props.selectedId)
      : null;

  const multiSelectedLabels =
    props.mode === 'multi'
      ? props.selectedIds
          .map((id) => props.options.find((option) => option.id === id)?.label)
          .filter((label): label is string => Boolean(label))
      : [];

  const multiDisplay = useMemo(() => {
    if (props.mode !== 'multi') return '';
    if (multiSelectedLabels.length === 0) return placeholder;
    const joined = multiSelectedLabels.join(', ');
    if (joined.length > 42) {
      return `${props.selectedIds.length} sélectionné${props.selectedIds.length > 1 ? 's' : ''}`;
    }
    return joined;
  }, [multiSelectedLabels, placeholder, props]);

  const atMaxMulti =
    props.mode === 'multi' &&
    props.maxSelection != null &&
    props.selectedIds.length >= props.maxSelection;

  const trimmedSearch = searchQuery.trim();
  const showCustomAddRow =
    props.mode === 'multi' &&
    props.searchable &&
    trimmedSearch.length > 1 &&
    filteredOptions.length === 0 &&
    !atMaxMulti;

  const handleSingleSelect = (id: string) => {
    if (props.mode !== 'single') return;
    props.onSelect(id);
    close();
  };

  const handleMultiToggle = (id: string) => {
    if (props.mode !== 'multi') return;
    const isSelected = props.selectedIds.includes(id);
    if (!isSelected && atMaxMulti) return;
    props.onToggle(id);
  };

  const handleCustomAdd = () => {
    if (props.mode !== 'multi' || !props.onAddCustom || !trimmedSearch) return;
    props.onAddCustom(trimmedSearch);
    setSearchQuery('');
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const dropdownStyle = useAnimatedStyle(() => ({
    opacity: dropdownProgress.value,
    transform: [{ translateY: (1 - dropdownProgress.value) * -8 }],
  }));

  const fieldValue = props.mode === 'single' ? selectedSingle?.label ?? placeholder : multiDisplay;

  const fieldHasValue =
    props.mode === 'single' ? props.selectedId !== null : props.selectedIds.length > 0;

  const SelectedIcon =
    props.mode === 'single' && selectedSingle ? resolveIcon(selectedSingle) : null;

  return (
    <View style={styles.container}>
      <Text variant="label" color={theme.colors.text.secondary} style={styles.label}>
        {props.label}
      </Text>

      <View
        ref={fieldRef}
        collapsable={false}
        onLayout={() => {
          if (isOpen) measureField();
        }}
      >
        <Pressable
          onPress={toggle}
          style={[
          styles.field,
          {
            backgroundColor: theme.colors.card.default,
            borderColor: isOpen ? theme.colors.brand.primary : theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${props.label}, ${fieldValue}`}
      >
        {SelectedIcon ? (
          <SelectedIcon size={20} color={theme.colors.brand.primaryLight} />
        ) : null}
        <Text
          variant="body"
          color={fieldHasValue ? theme.colors.text.primary : theme.colors.text.muted}
          style={styles.fieldText}
          numberOfLines={1}
        >
          {fieldValue}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color={theme.colors.text.muted} />
        </Animated.View>
      </Pressable>
      </View>

      <Modal visible={isOpen} transparent animationType="none" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Fermer la liste" />
        {fieldLayout ? (
          <Animated.View
            style={[
              styles.dropdownFloating,
              dropdownStyle,
              {
                top: fieldLayout.y + fieldLayout.height + 8,
                left: fieldLayout.x,
                width: fieldLayout.width,
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
                ...theme.shadows.md,
              },
            ]}
          >
            {props.mode === 'multi' && props.searchable ? (
              <View style={[styles.searchRow, { borderBottomColor: theme.colors.border.subtle }]}>
                <Search size={18} color={theme.colors.text.muted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Rechercher..."
                  placeholderTextColor={theme.colors.text.muted}
                  style={[styles.searchInput, { color: theme.colors.text.primary }]}
                  autoFocus
                  autoCorrect={false}
                />
              </View>
            ) : null}

            <ScrollView
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {filteredOptions.map((option) => {
                const selected =
                  props.mode === 'single'
                    ? props.selectedId === option.id
                    : props.selectedIds.includes(option.id);
                const disabled = props.mode === 'multi' && !selected && !!atMaxMulti;

                return (
                  <OptionRow
                    key={option.id}
                    option={option}
                    selected={selected}
                    disabled={disabled}
                    mode={props.mode}
                    onPress={() =>
                      props.mode === 'single'
                        ? handleSingleSelect(option.id)
                        : handleMultiToggle(option.id)
                    }
                  />
                );
              })}

              {showCustomAddRow ? (
                <Pressable onPress={handleCustomAdd} style={styles.customRow}>
                  <Text variant="body" color={theme.colors.brand.primary}>
                    + Ajouter « {trimmedSearch} » comme poste personnalisé
                  </Text>
                </Pressable>
              ) : null}
            </ScrollView>

            {props.mode === 'multi' && atMaxMulti ? (
              <Text variant="caption" color={theme.colors.text.muted} style={styles.maxHint}>
                Maximum {props.maxSelection} postes
              </Text>
            ) : null}

            {props.mode === 'multi' ? (
              <Pressable
                onPress={close}
                style={[styles.doneBtn, { borderTopColor: theme.colors.border.subtle }]}
                accessibilityRole="button"
                accessibilityLabel="Valider la sélection"
              >
                <Text variant="label" color={theme.colors.brand.primaryLight}>
                  Valider
                </Text>
              </Pressable>
            ) : null}
          </Animated.View>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  label: {
    marginBottom: 8,
  },
  field: {
    minHeight: 52,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldText: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  dropdownFloating: {
    position: 'absolute',
    zIndex: 30,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  list: {
    maxHeight: DROPDOWN_MAX_HEIGHT,
  },
  row: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowLabel: {
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {},
  customRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  maxHint: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
