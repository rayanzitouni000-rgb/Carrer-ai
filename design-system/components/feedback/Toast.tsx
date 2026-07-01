import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { IconName } from '../../tokens';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (toast: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastType, IconName> = {
  success: 'checkmark-circle-outline',
  error: 'close-circle-outline',
  warning: 'alert-circle-outline',
  info: 'information-circle-outline',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { ...toast, id }]);

      setTimeout(() => dismiss(id), toast.duration ?? 3500);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const typeColors: Record<ToastType, string> = {
    success: theme.colors.status.success,
    error: theme.colors.status.danger,
    warning: theme.colors.status.warning,
    info: theme.colors.status.info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={[styles.container, { top: insets.top + 8 }]} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={[
              styles.toast,
              theme.shadows.lg,
              {
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <Icon name={toastIcons[toast.type]} size="md" color={typeColors[toast.type]} />
            <View style={styles.toastText}>
              <Text variant="label" color={theme.colors.text.primary}>
                {toast.title}
              </Text>
              {toast.message && (
                <Text variant="caption" color={theme.colors.text.secondary}>
                  {toast.message}
                </Text>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  toastText: { flex: 1, gap: 2 },
});
