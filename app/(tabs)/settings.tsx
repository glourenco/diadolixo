import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { City, Zone } from '../../src/types';
import { CityZoneSelector } from '../../src/components/CityZoneSelector';
import { LanguageSelector } from '../../src/components/LanguageSelector';
import { NotificationOptIn } from '../../src/components/NotificationOptIn';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f7',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
    },
    header: {
      backgroundColor: 'white',
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
      marginBottom: 20,
    },
    headerContent: {
      padding: 24,
      alignItems: 'center',
    },
    headerIcon: {
      width: 64,
      height: 64,
      backgroundColor: '#3b82f6',
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#64748b',
      textAlign: 'center',
      lineHeight: 22,
    },
    section: {
      backgroundColor: 'white',
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
      marginBottom: 20,
    },
    sectionHeader: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
    },
    sectionContent: {
      padding: 24,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: '#64748b',
      lineHeight: 20,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    switch: {
      transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f2f7',
    },
    loadingCard: {
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      alignItems: 'center',
      maxWidth: 300,
    },
    loadingIcon: {
      width: 64,
      height: 64,
      backgroundColor: '#3b82f6',
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    loadingTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 8,
    },
    loadingText: {
      fontSize: 14,
      color: '#64748b',
      textAlign: 'center',
      marginBottom: 20,
    },
    loadingDots: {
      flexDirection: 'row',
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#3b82f6',
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingIcon}>
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          </View>
          <Text style={styles.loadingTitle}>{t('common.loading')}</Text>
          <Text style={styles.loadingText}>Loading settings...</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, { opacity: 0.3 }]} />
            <View style={[styles.dot, { opacity: 0.6 }]} />
            <View style={[styles.dot, { opacity: 1 }]} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Text style={{ fontSize: 28 }}>⚙️</Text>
              </View>
              <Text style={styles.headerTitle}>{t('settings.title')}</Text>
              <Text style={styles.headerSubtitle}>
                Configure your location, notifications, and language preferences
              </Text>
            </View>
          </View>

          {/* Location Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
            </View>
            <View style={styles.sectionContent}>
              {/* City Selection */}
              <View style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: '#f0f9ff' }]}>
                  <Text style={{ fontSize: 20 }}>🏙️</Text>
                </View>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingTitle}>{t('settings.city.title')}</Text>
                  <Text style={styles.settingDescription}>
                    Select your city to see available zones
                  </Text>
                </View>
              </View>
              
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

              {/* Zone Selection */}
              {cityId && (
                <>
                  <View style={[styles.settingItem, { marginTop: 16 }]}>
                    <View style={[styles.settingIcon, { backgroundColor: '#f0fdf4' }]}>
                      <Text style={{ fontSize: 20 }}>📍</Text>
                    </View>
                    <View style={styles.settingLeft}>
                      <Text style={styles.settingTitle}>{t('settings.zone.title')}</Text>
                      <Text style={styles.settingDescription}>
                        Choose your specific zone for accurate schedules
                      </Text>
                    </View>
                  </View>
                  
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
                </>
              )}
            </View>
          </View>

          {/* Notification Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔔 Notifications</Text>
            </View>
            <View style={styles.sectionContent}>
              <NotificationOptIn
                isEnabled={notificationsEnabled}
                onOptIn={handleNotificationsToggle}
              />
            </View>
          </View>

          {/* Language Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌐 Language</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: '#fef3c7' }]}>
                  <Text style={{ fontSize: 20 }}>🌐</Text>
                </View>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingTitle}>{t('settings.language.title')}</Text>
                  <Text style={styles.settingDescription}>
                    Choose your preferred language
                  </Text>
                </View>
              </View>
              
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
