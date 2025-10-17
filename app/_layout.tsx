import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../src/lib/i18n';
import { useSettingsStore } from '../src/store/useSettingsStore';

export default function RootLayout() {
  const { loadSettings, initializeNotifications } = useSettingsStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadSettings();
      await initializeNotifications();
    };
    
    initializeApp();
  }, [loadSettings, initializeNotifications]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
