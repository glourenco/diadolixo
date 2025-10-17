import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { City, Zone } from '../types';

interface ZoneSelectorProps {
  city: City;
  onZoneSelect: (zoneId: string) => void;
  onBack: () => void;
}

export function ZoneSelector({ city, onZoneSelect, onBack }: ZoneSelectorProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-4">
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-2xl font-bold text-gray-900">
                Zonas de {city.name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Selecione a sua zona para ver o calendário de recolhas
              </Text>
            </View>
            
            <View className="p-6">
              <TouchableOpacity
                onPress={onBack}
                className="flex-row items-center mb-4"
              >
                <Text className="text-blue-600 font-medium">← Voltar às cidades</Text>
              </TouchableOpacity>
              
              <View className="space-y-3">
                {city.zones.map((zone) => (
                  <TouchableOpacity
                    key={zone.id}
                    onPress={() => onZoneSelect(zone.id)}
                    className="bg-blue-50 rounded-2xl p-4 border border-blue-100"
                  >
                    <Text className="text-lg font-semibold text-blue-900 mb-1">
                      {zone.name}
                    </Text>
                    <Text className="text-sm text-blue-700">
                      {zone.description}
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
