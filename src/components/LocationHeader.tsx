import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LocationHeaderProps {
  onChangeLocation: () => void;
}

export function LocationHeader({ onChangeLocation }: LocationHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <View className="px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {t('calendar.title')}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {t('calendar.subtitle', 'Your weekly collection schedule')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onChangeLocation}
            className="bg-blue-50 rounded-2xl px-4 py-2 border border-blue-100"
          >
            <Text className="text-sm font-medium text-blue-800">
              Alterar zona
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
