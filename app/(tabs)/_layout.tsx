import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';

import { useTheme } from '@/design-system';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  return <Ionicons name={name} size={focused ? 24 : 22} color={color} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBar.active,
        tabBarInactiveTintColor: theme.colors.tabBar.inactive,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : undefined,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'android' ? theme.colors.tabBar.background : 'transparent',
          borderTopColor: theme.colors.border.subtle,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cv-manager"
        options={{
          title: 'CV Manager',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="job-match"
        options={{
          title: 'Job Match',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'briefcase' : 'briefcase-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
