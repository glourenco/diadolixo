import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notificationService';

interface NotificationDebugProps {
  visible?: boolean;
}

export function NotificationDebug({ visible = false }: NotificationDebugProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadTokenStatus();
  }, []);

  const loadTokenStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('device-token');
      setToken(storedToken);
      
      // Check if notifications are enabled in settings
      const settings = await AsyncStorage.getItem('dia-do-lixo-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setIsEnabled(parsed.notificationsEnabled || false);
      }
    } catch (error) {
      console.error('Error loading token status:', error);
    }
  };

  const handleRegisterToken = async () => {
    try {
      const newToken = await notificationService.registerForPushNotifications();
      if (newToken) {
        setToken(newToken);
        Alert.alert('Success', `Token registered: ${newToken.substring(0, 20)}...`);
      } else {
        Alert.alert('Error', 'Failed to register for notifications');
      }
    } catch (error) {
      console.error('Error registering token:', error);
      Alert.alert('Error', 'Failed to register for notifications');
    }
  };

  const handleTestNotification = async () => {
    try {
      // This would be used to test notifications
      Alert.alert('Test', 'Notification test would be sent here');
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  if (!visible) return null;

  return (
    <View className="p-4 bg-gray-100 rounded-lg m-4">
      <Text className="text-lg font-semibold mb-3">Notification Debug</Text>
      
      <View className="mb-3">
        <Text className="text-sm font-medium">Token Status:</Text>
        <Text className="text-xs text-gray-600 mt-1">
          {token ? `${token.substring(0, 30)}...` : 'No token'}
        </Text>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium">Notifications Enabled:</Text>
        <Text className="text-xs text-gray-600 mt-1">
          {isEnabled ? 'Yes' : 'No'}
        </Text>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={handleRegisterToken}
          className="bg-blue-600 px-3 py-2 rounded"
        >
          <Text className="text-white text-sm">Register Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTestNotification}
          className="bg-green-600 px-3 py-2 rounded"
          disabled={!token}
        >
          <Text className="text-white text-sm">Test Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

