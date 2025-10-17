import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_STORAGE_KEY = 'notification-token';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push notification token:', token);
    
    // Store token for later use
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleCollectionNotification(
  garbageType: string,
  collectionDate: Date,
  zoneName: string
) {
  const notificationDate = new Date(collectionDate);
  notificationDate.setDate(notificationDate.getDate() - 1); // Day before collection
  notificationDate.setHours(18, 0, 0, 0); // 6 PM

  // Don't schedule if the date is in the past
  if (notificationDate < new Date()) {
    return;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Dia do Lixo - Recolha Amanhã',
      body: `Amanhã será recolhido: ${garbageType} em ${zoneName}`,
      data: {
        garbageType,
        collectionDate: collectionDate.toISOString(),
        zoneName,
      },
    },
    trigger: notificationDate,
  });

  return notificationId;
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getStoredNotificationToken(): Promise<string | null> {
  return await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
}

