import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { City } from '../types';

interface CitySelectorProps {
  cities: City[];
  onCitySelect: (cityId: string) => void;
}

export function CitySelector({ cities, onCitySelect }: CitySelectorProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-4">
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-2xl font-bold text-gray-900">
                {t('settings.zone.placeholder')}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t('settings.zone.select_city_description', 'Choose your city to see collection schedules')}
              </Text>
            </View>
            
            <View className="p-6">
              <View className="space-y-3">
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => onCitySelect(city.id)}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                  >
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {city.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {city.zones.length} zonas disponíveis
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
