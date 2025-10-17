import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { GarbageType, CollectionSchedule } from '../types';
import { addDays, startOfDay } from 'date-fns';

const DEVICE_TOKEN_STORAGE_KEY = 'device-token';
const DEVICE_ID_STORAGE_KEY = 'device-id';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationService {
  registerForPushNotifications: () => Promise<string | null>;
  storeDeviceToken: (token: string, zoneId: string) => Promise<void>;
  updateDeviceTokenZone: (token: string, newZoneId: string) => Promise<void>;
  scheduleCollectionNotifications: (zoneId: string, schedules: CollectionSchedule[], garbageTypes: GarbageType[]) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  enableNotifications: (token: string) => Promise<void>;
  disableNotifications: (token: string) => Promise<void>;
}

class NotificationServiceImpl implements NotificationService {
  async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('garbage-collection', {
        name: 'Garbage Collection',
        description: 'Notifications for upcoming garbage collection',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
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
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      token = expoPushToken.data;
      console.log('Push notification token:', token);
      
      // Store token locally
      await AsyncStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
      
      // Generate or get device ID
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
      if (!deviceId) {
        deviceId = Device.modelId || 'unknown';
        await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  async storeDeviceToken(token: string, zoneId: string): Promise<void> {
    try {
      const deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY) || 'unknown';
      
      // Check if token already exists
      const { data: existingToken, error: fetchError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (existingToken) {
        // Update existing token with new zone (only if zoneId is provided)
        const updateData: any = {
          notifications_enabled: true,
          device_id: deviceId,
        };
        
        if (zoneId && zoneId !== '') {
          updateData.zone_id = zoneId;
        }

        const { error: updateError } = await supabase
          .from('device_tokens')
          .update(updateData)
          .eq('token', token);

        if (updateError) throw updateError;
      } else {
        // Insert new token (only if zoneId is provided)
        if (!zoneId || zoneId === '') {
          console.log('No zone ID provided, storing token without zone association');
          return;
        }

        const { error: insertError } = await supabase
          .from('device_tokens')
          .insert({
            token,
            device_id: deviceId,
            zone_id: zoneId,
            notifications_enabled: true,
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error storing device token:', error);
      throw error;
    }
  }

  async updateDeviceTokenZone(token: string, newZoneId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('device_tokens')
        .update({ zone_id: newZoneId })
        .eq('token', token);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating device token zone:', error);
      throw error;
    }
  }

  async scheduleCollectionNotifications(
    zoneId: string, 
    schedules: CollectionSchedule[], 
    garbageTypes: GarbageType[]
  ): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No device token available for notifications');
        return;
      }

      // Cancel existing notifications for this token
      await this.cancelAllNotifications();

      // Get device token record
      const { data: deviceToken, error: fetchError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (fetchError || !deviceToken) {
        console.log('Device token not found in database');
        return;
      }

      // Schedule notifications for the next 4 weeks
      const today = startOfDay(new Date());
      const notificationSchedules: any[] = [];

      for (let week = 0; week < 4; week++) {
        const weekStart = addDays(today, week * 7);
        
        for (const schedule of schedules) {
          if (!schedule.is_active) continue;
          
          const collectionDate = addDays(weekStart, schedule.day_of_week);
          const notificationDate = addDays(collectionDate, -1); // Day before
          notificationDate.setHours(18, 0, 0, 0); // 6 PM

          // Don't schedule if the notification date is in the past
          if (notificationDate < new Date()) continue;

          const garbageType = garbageTypes.find(gt => gt.id === schedule.garbage_type_id);
          if (!garbageType) continue;

          // Schedule local notification
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Dia do Lixo - Recolha Amanhã',
              body: `Amanhã será recolhido: ${garbageType.name_pt}`,
              data: {
                garbageType: garbageType.code,
                collectionDate: collectionDate.toISOString(),
                zoneId: zoneId,
              },
            },
            trigger: notificationDate,
          });

          // Store in database
          notificationSchedules.push({
            device_token_id: deviceToken.id,
            garbage_type_id: garbageType.id,
            scheduled_date: collectionDate.toISOString().split('T')[0],
            notification_date: notificationDate.toISOString(),
            expo_notification_id: notificationId,
            status: 'scheduled',
          });
        }
      }

      // Insert all notification schedules
      if (notificationSchedules.length > 0) {
        const { error: insertError } = await supabase
          .from('notification_schedules')
          .insert(notificationSchedules);

        if (insertError) throw insertError;
      }

      console.log(`Scheduled ${notificationSchedules.length} notifications`);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      throw error;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      // Cancel local notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Update database status
      const token = await AsyncStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
      if (token) {
        const { data: deviceToken } = await supabase
          .from('device_tokens')
          .select('id')
          .eq('token', token)
          .single();

        if (deviceToken) {
          await supabase
            .from('notification_schedules')
            .update({ status: 'cancelled' })
            .eq('device_token_id', deviceToken.id)
            .eq('status', 'scheduled');
        }
      }
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      throw error;
    }
  }

  async enableNotifications(token: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('device_tokens')
        .update({ notifications_enabled: true })
        .eq('token', token);

      if (error) throw error;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    }
  }

  async disableNotifications(token: string): Promise<void> {
    try {
      // Cancel all notifications
      await this.cancelAllNotifications();

      // Update database
      const { error } = await supabase
        .from('device_tokens')
        .update({ notifications_enabled: false })
        .eq('token', token);

      if (error) throw error;
    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationServiceImpl();

