import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { City, Zone } from '../../src/types';
import { CityZoneSelector } from '../../src/components/CityZoneSelector';
import { LanguageSelector } from '../../src/components/LanguageSelector';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const {
    cityId,
    zoneId,
    notificationsEnabled,
    language,
    setCityId,
    setZoneId,
    setNotificationsEnabled,
    setLanguage,
    saveSettings,
  } = useSettingsStore();

  const [cities, setCities] = useState<City[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (cityId) {
      loadZones(cityId);
    } else {
      setZones([]);
    }
  }, [cityId]);

  const loadCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name_pt');

      if (error) throw error;
      setCities(data as City[]);
    } catch (error) {
      console.error('Error loading cities:', error);
      Alert.alert(t('common.error'), 'Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async (cityId: string) => {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('city_id', cityId)
        .order('name_pt');

      if (error) throw error;
      setZones(data as Zone[]);
    } catch (error) {
      console.error('Error loading zones:', error);
      Alert.alert(t('common.error'), 'Failed to load zones');
    }
  };

  const handleCityChange = async (newCityId: string) => {
    setCityId(newCityId);
    setZoneId(null); // Reset zone when city changes
    await saveSettings();
  };

  const handleZoneChange = async (newZoneId: string) => {
    await setZoneId(newZoneId);
    await saveSettings();
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    await setNotificationsEnabled(enabled);
    await saveSettings();
  };

  const handleLanguageChange = async (newLanguage: 'pt' | 'en' | 'es') => {
    setLanguage(newLanguage);
    await saveSettings();
  };

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
            {t('settings.title')}
          </Text>

          {/* City Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {t('settings.city.title')}
            </Text>
            <CityZoneSelector
              items={cities}
              selectedId={cityId}
              onSelect={handleCityChange}
              getDisplayName={(city) => {
                switch (language) {
                  case 'pt': return city.name_pt;
                  case 'en': return city.name_en;
                  case 'es': return city.name_es;
                  default: return city.name_pt;
                }
              }}
              placeholder={t('settings.city.placeholder')}
            />
          </View>

          {/* Zone Selection */}
          {cityId && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                {t('settings.zone.title')}
              </Text>
              <CityZoneSelector
                items={zones}
                selectedId={zoneId}
                onSelect={handleZoneChange}
                getDisplayName={(zone) => {
                  switch (language) {
                    case 'pt': return zone.name_pt;
                    case 'en': return zone.name_en;
                    case 'es': return zone.name_es;
                    default: return zone.name_pt;
                  }
                }}
                placeholder={t('settings.zone.placeholder')}
              />
            </View>
          )}

          {/* Notifications */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {t('settings.notifications.title')}
            </Text>
            <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-medium text-gray-900">
                    {notificationsEnabled ? t('settings.notifications.enabled') : t('settings.notifications.disabled')}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {t('settings.notifications.description')}
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {/* Language */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {t('settings.language.title')}
            </Text>
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
