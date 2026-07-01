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
import { careerProfileStore } from '@/services/careerProfileStore';
import { authService } from '@/services/authService';

export function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = careerProfileStore.get();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await authService.register({
      email,
      password,
      firstName: profile.firstName,
    });
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
          Create your account
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Save your career profile and access CareerPilot AI anywhere.
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
          placeholder="At least 6 characters"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />
        <Input
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />

        {error && (
          <Text variant="caption" color={theme.colors.status.danger}>
            {error}
          </Text>
        )}

        <PrimaryButton
          label="Create account"
          onPress={handleSignup}
          loading={loading}
          disabled={!email.trim() || !password.trim() || !confirmPassword.trim()}
          fullWidth
          size="lg"
        />
      </Card>

      <OutlineButton
        label="Already have an account? Sign in"
        onPress={() => router.replace('/login')}
        fullWidth
      />

      <Text variant="caption" color={theme.colors.text.muted} align="center">
        Your profile and account are saved locally on this device.
      </Text>
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
