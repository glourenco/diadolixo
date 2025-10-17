import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { getMonthlyCollections } from '../../src/utils/collectionUtils';
import { WeeklyCollection, GarbageType, CollectionSchedule, City } from '../../src/types';
import { ModernCalendar, CitySelector, ZoneSelector, LocationHeader } from '../../src/components';
import { CityService } from '../../src/services/cityService';
import { notificationService } from '../../src/services/notificationService';


export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { zoneId, language, notificationsEnabled, setZoneId } = useSettingsStore();
  const [monthlyCollection, setMonthlyCollection] = useState<WeeklyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(!zoneId);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);

  // Load cities from Supabase
  useEffect(() => {
    const loadCities = async () => {
      try {
        setCitiesLoading(true);
        const citiesData = await CityService.getCities();
        setCities(citiesData);
        
        // Set default city and zone if none selected
        if (!zoneId && citiesData.length > 0) {
          const seixalCity = citiesData.find(city => city.name === 'Seixal');
          if (seixalCity && seixalCity.zones.length > 0) {
            const valadaresZone = seixalCity.zones.find(zone => zone.name === 'Valadares');
            if (valadaresZone) {
              setZoneId(valadaresZone.id);
              setSelectedCity(seixalCity);
              setSelectedZoneName(valadaresZone.name);
              setShowCitySelector(false);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        Alert.alert(t('common.error'), 'Failed to load cities');
      } finally {
        setCitiesLoading(false);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (zoneId) {
      loadCollectionData();
    } else {
      setLoading(false);
    }
  }, [zoneId, currentMonth]);

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
      
      console.log('Loaded schedules:', schedules);

      // Generate monthly collection data
      const monthlyData = getMonthlyCollections(
        currentMonth,
        schedules as CollectionSchedule[],
        garbageTypes as GarbageType[]
      );

      setMonthlyCollection(monthlyData);

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
    console.log(`Navigating to ${direction} month: ${newMonth.toLocaleDateString()}`);
  };

  const handleCitySelect = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    setSelectedCity(city || null);
  };

  const handleZoneSelect = (zoneId: string) => {
    setZoneId(zoneId);
    setShowCitySelector(false);
    setSelectedCity(null);
    
    // Find and set the zone name
    if (selectedCity) {
      const zone = selectedCity.zones.find(z => z.id === zoneId);
      if (zone) {
        setSelectedZoneName(zone.name);
      }
    }
  };

  const handleChangeLocation = () => {
    setShowCitySelector(true);
    setSelectedCity(null);
  };

  const handleBackToCities = () => {
    setSelectedCity(null);
  };

  const renderLocationSelector = () => {
    if (citiesLoading) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 items-center justify-center px-8">
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 w-full max-w-sm">
              <View className="items-center">
                {/* Animated loading icon */}
                <View className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
                  <Text className="text-2xl">🏙️</Text>
                </View>
                
                {/* Loading text with better typography */}
                <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {t('common.loading')}
                </Text>
                <Text className="text-sm text-gray-600 text-center mb-6 leading-5">
                  Loading cities and zones...
                </Text>
                
                {/* Modern loading indicator */}
                <View className="flex-row space-x-2">
                  <View className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                  <View className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    if (!selectedCity) {
      return <CitySelector cities={cities} onCitySelect={handleCitySelect} />;
    }
    
    return (
      <ZoneSelector
        city={selectedCity}
        onZoneSelect={handleZoneSelect}
        onBack={handleBackToCities}
      />
    );
  };

  // Only show full-screen loading for initial data load (when no zone is selected)
  if (loading && !zoneId && !citiesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 w-full max-w-sm">
            <View className="items-center">
              {/* Animated loading icon */}
              <View className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
                <Text className="text-2xl">🗑️</Text>
              </View>
              
              {/* Loading text with better typography */}
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                {t('common.loading')}
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6 leading-5">
                {t('common.loading_description', 'Loading collection data...')}
              </Text>
              
              {/* Modern loading indicator */}
              <View className="flex-row space-x-2">
                <View className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <View className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <View className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (showCitySelector) {
    return renderLocationSelector();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-4">
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="p-6">
              <ModernCalendar
                weeklyCollection={monthlyCollection}
                currentWeek={currentMonth}
                onNavigateWeek={navigateMonth}
                onCitySelect={handleCitySelect}
                onZoneSelect={handleZoneSelect}
                selectedCity={selectedCity}
                selectedZone={zoneId}
                selectedZoneName={selectedZoneName}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
