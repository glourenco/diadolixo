import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { WeeklyCollection, GarbageType } from '../types';
import { formatWeekDayShort, isToday } from '../utils/dateUtils';
import { GarbageTypeCard } from './GarbageTypeCard';

const { width } = Dimensions.get('window');

interface CalendarWeekViewProps {
  weeklyCollection: WeeklyCollection | null;
  currentWeek: Date;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export function CalendarWeekView({ weeklyCollection, currentWeek, onNavigateWeek }: CalendarWeekViewProps) {
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
      marginHorizontal: 4,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    navButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerCenter: {
      alignItems: 'center',
    },
    headerTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
      fontWeight: '500',
      marginTop: 2,
    },
    weekGrid: {
      padding: 20,
      backgroundColor: '#fafbfc',
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dayCard: {
      width: (width - 80) / 7,
      borderRadius: 20,
      padding: 16,
      minHeight: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    dayCardCurrent: {
      backgroundColor: '#ffffff',
      borderWidth: 3,
      borderColor: '#3b82f6',
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    dayCardRegular: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    dayHeader: {
      alignItems: 'center',
      marginBottom: 16,
    },
    dayName: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    dayNameCurrent: {
      color: '#3b82f6',
    },
    dayNameRegular: {
      color: '#6b7280',
    },
    dayNumber: {
      fontSize: 28,
      fontWeight: '800',
      marginTop: 6,
    },
    dayNumberCurrent: {
      color: '#1e40af',
    },
    dayNumberRegular: {
      color: '#111827',
    },
    noCollectionContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    noCollectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    noCollectionIconCurrent: {
      backgroundColor: '#dbeafe',
    },
    noCollectionIconRegular: {
      backgroundColor: '#f3f4f6',
    },
    noCollectionText: {
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 14,
    },
    noCollectionTextCurrent: {
      color: '#3b82f6',
    },
    noCollectionTextRegular: {
      color: '#9ca3af',
    },
    collectionBadge: {
      borderRadius: 16,
      padding: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    collectionText: {
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 13,
    },
    collectionIcon: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 4,
    },
  });

  if (!weeklyCollection) {
    return (
      <View className="bg-gray-50 rounded-2xl p-8">
        <View className="items-center">
          <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mb-3">
            <Text className="text-lg">📅</Text>
          </View>
          <Text className="text-sm font-medium text-gray-600 text-center">
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  const getGarbageTypeIcon = (code: string) => {
    const icons: { [key: string]: string } = {
      'papel': '📄',
      'embalagens': '📦',
      'bioresiduos': '🍃',
      'indiferenciados': '🗑️',
      'vidro': '🍾',
      'metal': '🔧',
    };
    return icons[code] || '🗑️';
  };

  const renderModernDayCard = (collectionDay: { date: Date; garbageTypes: GarbageType[] }, index: number) => {
    const { date, garbageTypes } = collectionDay;
    const isCurrentDay = isToday(date);
    const dayName = formatWeekDayShort(date, 'pt');
    const dayNumber = date.getDate();
    
    return (
      <View key={index}>
        <View style={[
          styles.dayCard,
          isCurrentDay ? styles.dayCardCurrent : styles.dayCardRegular
        ]}>
          {/* Day Header */}
          <View style={styles.dayHeader}>
            <Text style={[
              styles.dayName,
              isCurrentDay ? styles.dayNameCurrent : styles.dayNameRegular
            ]}>
              {dayName}
            </Text>
            <Text style={[
              styles.dayNumber,
              isCurrentDay ? styles.dayNumberCurrent : styles.dayNumberRegular
            ]}>
              {dayNumber}
            </Text>
          </View>
          
          {/* Collection Content */}
          <View style={{ flex: 1 }}>
            {garbageTypes.length === 0 ? (
              <View style={styles.noCollectionContainer}>
                <View style={[
                  styles.noCollectionIcon,
                  isCurrentDay ? styles.noCollectionIconCurrent : styles.noCollectionIconRegular
                ]}>
                  <Text style={[
                    styles.noCollectionText,
                    isCurrentDay ? styles.noCollectionTextCurrent : styles.noCollectionTextRegular
                  ]}>😴</Text>
                </View>
                <Text style={[
                  styles.noCollectionText,
                  isCurrentDay ? styles.noCollectionTextCurrent : styles.noCollectionTextRegular
                ]}>
                  Sem recolha
                </Text>
              </View>
            ) : (
              <View>
                {garbageTypes.map((garbageType) => (
                  <View
                    key={garbageType.id}
                    style={[
                      styles.collectionBadge,
                      { backgroundColor: garbageType.color_hex + '25' }
                    ]}
                  >
                    <Text style={styles.collectionIcon}>
                      {getGarbageTypeIcon(garbageType.code)}
                    </Text>
                    <Text style={[
                      styles.collectionText,
                      { color: garbageType.color_hex }
                    ]}>
                      {garbageType.name_pt}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {/* Week Navigation Header with Gradient */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8', '#1e40af']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => onNavigateWeek('prev')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {t('calendar.week')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentWeek.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onNavigateWeek('next')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Week Days Grid */}
      <View style={styles.weekGrid}>
        <View style={styles.weekRow}>
          {weeklyCollection.collections.map((collectionDay, index) => (
            renderModernDayCard(collectionDay, index)
          ))}
        </View>
      </View>
    </View>
  );
}
