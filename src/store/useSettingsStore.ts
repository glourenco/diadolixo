import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { notificationService } from '../services/notificationService';

interface Settings {
  cityId: string | null;
  zoneId: string | null;
  notificationsEnabled: boolean;
  language: 'pt' | 'en' | 'es';
}

interface SettingsStore extends Settings {
  setCityId: (cityId: string | null) => void;
  setZoneId: (zoneId: string | null) => void;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setLanguage: (language: 'pt' | 'en' | 'es') => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  initializeNotifications: () => Promise<void>;
}

const STORAGE_KEY = 'dia-do-lixo-settings';

const defaultSettings: Settings = {
  cityId: null,
  zoneId: null,
  notificationsEnabled: false,
  language: 'pt',
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,

  setCityId: (cityId) => set({ cityId }),
  setZoneId: async (zoneId) => {
    const { notificationsEnabled } = get();
    set({ zoneId });
    
    // If notifications are enabled and we have a zone, store/update the device token
    if (notificationsEnabled && zoneId) {
      try {
        const token = await AsyncStorage.getItem('device-token');
        if (token) {
          // Store the device token with the zone in the database
          await notificationService.storeDeviceToken(token, zoneId);
          console.log('Device token stored with zone:', zoneId);
        }
      } catch (error) {
        console.error('Error updating device token zone:', error);
      }
    }
  },
  setNotificationsEnabled: async (notificationsEnabled) => {
    set({ notificationsEnabled });
    
    try {
      if (notificationsEnabled) {
        // Register for push notifications and get token
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          // Store the token locally for now (zone will be set when user selects a zone)
          await AsyncStorage.setItem('device-token', token);
          console.log('Notification token registered and stored locally');
        }
      } else {
        // Get existing token and disable notifications
        const token = await AsyncStorage.getItem('device-token');
        if (token) {
          await notificationService.disableNotifications(token);
        }
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Revert the state if there was an error
      set({ notificationsEnabled: !notificationsEnabled });
      throw error;
    }
  },
  setLanguage: (language) => set({ language }),

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        set(settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const settings = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  initializeNotifications: async () => {
    try {
      const { notificationsEnabled, zoneId } = get();
      
      if (notificationsEnabled && zoneId) {
        // Register for push notifications and store token
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          await notificationService.storeDeviceToken(token, zoneId);
        }
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  },
}));
