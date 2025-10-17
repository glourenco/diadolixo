import { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerForPushNotificationsAsync } from './src/lib/notifications';
import { useSettingsStore } from './src/store/useSettingsStore';
import './src/styles/global.css';

function App() {
  const { notificationsEnabled } = useSettingsStore();

  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotificationsAsync();
    }
  }, [notificationsEnabled]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {/* The actual app content will be handled by expo-router */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);

