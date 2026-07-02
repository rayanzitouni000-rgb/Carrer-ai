import { Stack } from 'expo-router';

export default function InterviewSimulatorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="session" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="onboarding-assessment" />
      <Stack.Screen name="my-interviews" />
      <Stack.Screen name="add-interview" />
    </Stack>
  );
}
