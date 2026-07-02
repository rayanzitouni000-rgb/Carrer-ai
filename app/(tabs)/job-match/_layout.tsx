import { Stack } from 'expo-router';

import { JobSearchProvider } from '@/hooks/useJobSearch';

export default function JobMatchLayout() {
  return (
    <JobSearchProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="location-setup" options={{ presentation: 'modal', gestureEnabled: false }} />
        <Stack.Screen name="filters" options={{ presentation: 'modal' }} />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="saved" />
      </Stack>
    </JobSearchProvider>
  );
}
