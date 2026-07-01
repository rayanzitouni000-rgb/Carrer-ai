import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  Card,
  Input,
  OutlineButton,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
} from '@/design-system';
import { authService } from '@/services/authService';

export function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const result = await authService.login({ email, password });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable safeAreaBottom>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          Welcome back
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Sign in to continue your AI career journey.
        </Text>
      </View>

      <Card variant="elevated" padding="5" style={styles.card}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />

        {error && (
          <Text variant="caption" color={theme.colors.status.danger}>
            {error}
          </Text>
        )}

        <PrimaryButton
          label="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim() || !password.trim()}
          fullWidth
          size="lg"
        />
      </Card>

      <OutlineButton
        label="Create an account"
        onPress={() => router.replace('/signup')}
        fullWidth
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  card: {
    gap: 16,
    marginBottom: 16,
  },
});
