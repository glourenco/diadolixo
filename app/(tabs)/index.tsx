import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { getWeeklyCollections } from '../../src/utils/collectionUtils';
import { WeeklyCollection, GarbageType, CollectionSchedule } from '../../src/types';
import { formatWeekDayShort, isToday } from '../../src/utils/dateUtils';
import { CalendarWeekView } from '../../src/components/CalendarWeekView';
import { GarbageTypeCard } from '../../src/components/GarbageTypeCard';
import { notificationService } from '../../src/services/notificationService';

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { zoneId, language, notificationsEnabled } = useSettingsStore();
  const [weeklyCollection, setWeeklyCollection] = useState<WeeklyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (zoneId) {
      loadCollectionData();
    } else {
      setLoading(false);
    }
  }, [zoneId, currentWeek]);

  const loadCollectionData = async () => {
    if (!zoneId) return;

    try {
      setLoading(true);

      // Fetch garbage types
      const { data: garbageTypes, error: garbageError } = await supabase
        .from('garbage_types')
        .select('*')
        .order('code');

      if (garbageError) throw garbageError;

      // Fetch collection schedules for the zone
      const { data: schedules, error: scheduleError } = await supabase
        .from('collection_schedules')
        .select('*')
        .eq('zone_id', zoneId)
        .eq('is_active', true);

      if (scheduleError) throw scheduleError;

      // Generate weekly collection data
      const weeklyData = getWeeklyCollections(
        currentWeek,
        schedules as CollectionSchedule[],
        garbageTypes as GarbageType[]
      );

      setWeeklyCollection(weeklyData);

      // Schedule notifications if enabled
      if (notificationsEnabled) {
        await notificationService.scheduleCollectionNotifications(
          zoneId,
          schedules as CollectionSchedule[],
          garbageTypes as GarbageType[]
        );
      }
    } catch (error) {
      console.error('Error loading collection data:', error);
      Alert.alert(t('common.error'), 'Failed to load collection data');
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (!zoneId) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-full max-w-sm">
            <View className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <View className="items-center mb-6">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Text className="text-2xl">🗺️</Text>
                </View>
                <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {t('settings.zone.placeholder')}
                </Text>
                <Text className="text-sm text-gray-500 text-center leading-5">
                  {t('settings.title')}
                </Text>
              </View>
              
              <View className="space-y-3">
                <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    {t('settings.zone.select_city', 'Select your city')}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {t('settings.zone.select_city_description', 'Choose your city to see collection schedules')}
                  </Text>
                </View>
                
                <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <Text className="text-sm font-medium text-blue-800 mb-1">
                    {t('settings.zone.notifications', 'Get notifications')}
                  </Text>
                  <Text className="text-xs text-blue-600">
                    {t('settings.zone.notifications_description', 'Receive reminders before collection days')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            {t('calendar.title')}
          </Text>
          
          <CalendarWeekView
            weeklyCollection={weeklyCollection}
            currentWeek={currentWeek}
            onNavigateWeek={navigateWeek}
          />
        </View>
      </ScrollView>
    </View>
  );
}
