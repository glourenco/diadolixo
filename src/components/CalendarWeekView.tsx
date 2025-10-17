import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WeeklyCollection, GarbageType } from '../types';
import { formatWeekDayShort, isToday } from '../utils/dateUtils';
import { GarbageTypeCard } from './GarbageTypeCard';

interface CalendarWeekViewProps {
  weeklyCollection: WeeklyCollection | null;
  currentWeek: Date;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export function CalendarWeekView({ weeklyCollection, currentWeek, onNavigateWeek }: CalendarWeekViewProps) {
  const { t } = useTranslation();

  if (!weeklyCollection) {
    return (
      <View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <Text className="text-center text-gray-500">{t('common.loading')}</Text>
      </View>
    );
  }

  const formatWeekHeader = (date: Date) => {
    const dayName = formatWeekDayShort(date, 'pt');
    const dayNumber = date.getDate();
    const isCurrentDay = isToday(date);
    
    return (
      <View key={date.toISOString()} className="flex-1">
        <View className={`p-2 rounded-lg ${isCurrentDay ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-medium text-center ${isCurrentDay ? 'text-blue-800' : 'text-gray-600'}`}>
            {dayName}
          </Text>
          <Text className={`text-sm font-bold text-center mt-1 ${isCurrentDay ? 'text-blue-900' : 'text-gray-900'}`}>
            {dayNumber}
          </Text>
        </View>
      </View>
    );
  };

  const renderDayContent = (collectionDay: { date: Date; garbageTypes: GarbageType[] }) => {
    const { date, garbageTypes } = collectionDay;
    const isCurrentDay = isToday(date);

    if (garbageTypes.length === 0) {
      return (
        <View className={`p-3 rounded-lg mt-2 ${isCurrentDay ? 'bg-gray-50' : 'bg-white'}`}>
          <Text className={`text-xs text-center ${isCurrentDay ? 'text-gray-600' : 'text-gray-400'}`}>
            {t('calendar.noCollection')}
          </Text>
        </View>
      );
    }

    return (
      <View className="mt-2 space-y-2">
        {garbageTypes.map((garbageType) => (
          <GarbageTypeCard
            key={garbageType.id}
            garbageType={garbageType}
            compact={true}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Week Navigation */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => onNavigateWeek('prev')}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Text className="text-gray-600 font-semibold">‹</Text>
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900">
          {t('calendar.week')}
        </Text>
        
        <TouchableOpacity
          onPress={() => onNavigateWeek('next')}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Text className="text-gray-600 font-semibold">›</Text>
        </TouchableOpacity>
      </View>

      {/* Week Header */}
      <View className="flex-row px-4 py-3 border-b border-gray-200">
        {weeklyCollection.week.map(formatWeekHeader)}
      </View>

      {/* Week Content */}
      <View className="p-4">
        <View className="flex-row">
          {weeklyCollection.collections.map((collectionDay, index) => (
            <View key={index} className="flex-1 px-1">
              {renderDayContent(collectionDay)}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
