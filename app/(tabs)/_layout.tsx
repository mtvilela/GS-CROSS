import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useMission } from '@/context/MissionContext';
import { colors } from '@/theme';

/** Navegação por abas entre as áreas principais da central. */
export default function TabsLayout() {
  const { unacknowledgedCount } = useMission();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.spaceDeep },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.spaceDeep,
          borderTopColor: colors.panelBorder,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Centro de Controle',
          tabBarLabel: 'Painel',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="telemetry"
        options={{
          title: 'Telemetria',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarBadge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.critical, color: colors.spaceDeep },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarLabel: 'Config',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
