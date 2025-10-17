import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notificationService';

interface NotificationOptInProps {
  onOptIn: (enabled: boolean) => void;
  isEnabled: boolean;
}

export function NotificationOptIn({ onOptIn, isEnabled }: NotificationOptInProps) {
  const { t } = useTranslation();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleOptIn = async () => {
    try {
      setIsRequesting(true);

      // Request notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        // Register for push notifications
        const token = await notificationService.registerForPushNotifications();
        
        if (token) {
          // Store the token (zone will be set when user selects a zone)
          await notificationService.storeDeviceToken(token, '');
          onOptIn(true);
          
          Alert.alert(
            t('notifications.success.title', 'Notifications Enabled'),
            t('notifications.success.message', 'You will now receive collection reminders!'),
            [{ text: t('common.ok', 'OK') }]
          );
        } else {
          throw new Error('Failed to get notification token');
        }
      } else {
        Alert.alert(
          t('notifications.permission_denied.title', 'Permission Denied'),
          t('notifications.permission_denied.message', 'Please enable notifications in your device settings to receive collection reminders.'),
          [{ text: t('common.ok', 'OK') }]
        );
      }
    } catch (error) {
      console.error('Error opting in to notifications:', error);
      Alert.alert(
        t('common.error'),
        t('notifications.error.message', 'Failed to enable notifications. Please try again.')
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleOptOut = async () => {
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        await notificationService.disableNotifications(token);
      }
      onOptIn(false);
    } catch (error) {
      console.error('Error opting out of notifications:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isEnabled ? '#10b981' : '#f59e0b',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
      flex: 1,
    },
    description: {
      fontSize: 14,
      color: '#64748b',
      lineHeight: 20,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
    },
    secondaryButton: {
      backgroundColor: '#f1f5f9',
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: 'white',
    },
    secondaryButtonText: {
      color: '#64748b',
    },
    disabledButton: {
      backgroundColor: '#f1f5f9',
      opacity: 0.6,
    },
    disabledButtonText: {
      color: '#94a3b8',
    },
  });

  if (isEnabled) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </View>
          <Text style={styles.title}>
            {t('notifications.enabled.title', 'Notifications Enabled')}
          </Text>
        </View>
        <Text style={styles.description}>
          {t('notifications.enabled.description', 'You will receive reminders about upcoming garbage collection days.')}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleOptOut}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {t('notifications.disable', 'Disable Notifications')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 20 }}>🔕</Text>
        </View>
        <Text style={styles.title}>
          {t('notifications.opt_in.title', 'Enable Notifications')}
        </Text>
      </View>
      <Text style={styles.description}>
        {t('notifications.opt_in.description', 'Get reminded about upcoming garbage collection days. We will send you a notification the day before collection.')}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            isRequesting && styles.disabledButton
          ]}
          onPress={() => onOptIn(false)}
          disabled={isRequesting}
        >
          <Text style={[
            styles.buttonText,
            styles.secondaryButtonText,
            isRequesting && styles.disabledButtonText
          ]}>
            {t('common.not_now', 'Not Now')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isRequesting && styles.disabledButton
          ]}
          onPress={handleOptIn}
          disabled={isRequesting}
        >
          <Text style={[
            styles.buttonText,
            styles.primaryButtonText,
            isRequesting && styles.disabledButtonText
          ]}>
            {isRequesting 
              ? t('common.enabling', 'Enabling...') 
              : t('notifications.enable', 'Enable Notifications')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
