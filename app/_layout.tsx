import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MissionProvider } from '@/context/MissionContext';
import { colors } from '@/theme';

/**
 * Layout raiz do app.
 * Envolve toda a navegação no MissionProvider (Context API) para que
 * qualquer tela acesse o estado global da missão.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MissionProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.spaceDeep },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.space },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="mission-setup"
            options={{ presentation: 'modal', title: 'Configurar Missão' }}
          />
          <Stack.Screen
            name="metric-edit"
            options={{ presentation: 'modal', title: 'Atualizar Métrica' }}
          />
        </Stack>
      </MissionProvider>
    </SafeAreaProvider>
  );
}
