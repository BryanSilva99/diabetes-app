import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { healthThemes } from '@/constants/health-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = healthThemes[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 88,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prediccion',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="monitor-heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          title: 'Resultado',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="analytics" color={color} />,
        }}
      />
    </Tabs>
  );
}
