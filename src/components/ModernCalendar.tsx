import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { WeeklyCollection, GarbageType, City } from '../types';
import { isToday, formatDate } from '../utils/dateUtils';

interface ModernCalendarProps {
  weeklyCollection: WeeklyCollection | null;
  currentWeek: Date;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onCitySelect?: (cityId: string) => void;
  onZoneSelect?: (zoneId: string) => void;
  selectedCity?: City | null;
  selectedZone?: string | null;
  selectedZoneName?: string | null;
  loading?: boolean;
}

export function ModernCalendar({ 
  weeklyCollection, 
  currentWeek, 
  onNavigateWeek, 
  onCitySelect, 
  onZoneSelect, 
  selectedCity, 
  selectedZone,
  selectedZoneName,
  loading = false
}: ModernCalendarProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showZoneSelector, setShowZoneSelector] = useState(false);

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

  const getMarkedDates = () => {
    if (!weeklyCollection) return {};

    const markedDates: { [key: string]: any } = {};

    console.log('Weekly collection data:', weeklyCollection);

    weeklyCollection.collections.forEach((collectionDay) => {
      // Use local date string to avoid timezone issues
      const year = collectionDay.date.getFullYear();
      const month = String(collectionDay.date.getMonth() + 1).padStart(2, '0');
      const day = String(collectionDay.date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const isCurrentDay = isToday(collectionDay.date);
      const dayName = collectionDay.date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (collectionDay.garbageTypes.length > 0) {
        // Use the first garbage type color as the day background color
        const primaryColor = collectionDay.garbageTypes[0].color_hex;
        console.log(`Date ${dateString} (${dayName}): ${collectionDay.garbageTypes[0].name_pt} - Color: ${primaryColor}`);
        
        markedDates[dateString] = {
          startingDay: true,
          endingDay: true,
          color: primaryColor,
          textColor: '#ffffff',
          // Add a white stroke/border for today to make it more evident
          selected: isCurrentDay,
          selectedColor: isCurrentDay ? '#ffffff' : primaryColor,
          selectedTextColor: isCurrentDay ? '#000000' : '#ffffff',
        };
      } else {
        markedDates[dateString] = {
          marked: false,
          selected: isCurrentDay,
          selectedColor: isCurrentDay ? '#3b82f6' : '#e5e7eb',
          selectedTextColor: isCurrentDay ? '#ffffff' : '#000000',
        };
      }
    });

    return markedDates;
  };

  const getSelectedDateCollections = () => {
    if (!weeklyCollection) return [];
    
    const selectedDateObj = new Date(selectedDate);
    const collectionDay = weeklyCollection.collections.find(
      (day) => day.date.toDateString() === selectedDateObj.toDateString()
    );
    
    return collectionDay?.garbageTypes || [];
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
      marginHorizontal: 4,
    },
    filterContainer: {
      backgroundColor: '#f8fafc',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 12,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#d1d5db',
      backgroundColor: 'white',
    },
    filterButtonActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6b7280',
    },
    filterButtonTextActive: {
      color: 'white',
    },
    calendarContainer: {
      padding: 16,
    },
    selectedDateInfo: {
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    selectedDateTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 8,
    },
    noCollectionText: {
      fontSize: 14,
      color: '#64748b',
      fontStyle: 'italic',
    },
    collectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    collectionIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    collectionText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1e293b',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
    },
    loadingContainer: {
      alignItems: 'center',
    },
    loadingSpinner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    loadingText: {
      fontSize: 20,
      color: 'white',
    },
    loadingLabel: {
      fontSize: 14,
      color: '#64748b',
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      {/* City and Zone Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Localização</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCitySelector(true)}
          >
            <Text style={styles.filterButtonText}>
              🏙️ {selectedCity?.name || 'Selecionar cidade'}
            </Text>
          </TouchableOpacity>
          
          {selectedCity && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowZoneSelector(true)}
            >
              <Text style={styles.filterButtonText}>
                📍 {selectedZoneName || 'Selecionar zona'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={currentWeek.toISOString().split('T')[0]}
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          onMonthChange={(month: any) => {
            const newDate = new Date(month.year, month.month - 1, 1);
            if (newDate.getMonth() !== currentWeek.getMonth() || newDate.getFullYear() !== currentWeek.getFullYear()) {
              onNavigateWeek(newDate > currentWeek ? 'next' : 'prev');
            }
          }}
          markedDates={getMarkedDates()}
          markingType={'period'}
          monthFormat={'MMMM yyyy'}
          hideExtraDays={true}
          firstDay={1}
          showWeekNumbers={false}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#3b82f6',
            selectedDayBackgroundColor: '#3b82f6',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#3b82f6',
            dayTextColor: '#1e293b',
            textDisabledColor: '#94a3b8',
            dotColor: '#3b82f6',
            selectedDotColor: '#ffffff',
            arrowColor: '#3b82f6',
            disabledArrowColor: '#94a3b8',
            monthTextColor: '#1e293b',
            indicatorColor: '#3b82f6',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
            'stylesheet.calendar.header': {
              week: {
                marginTop: 7,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
            'stylesheet.day.basic': {
              today: {
                backgroundColor: '#3b82f6',
                borderRadius: 20,
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              },
              todayText: {
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 16,
              },
              base: {
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
              },
              text: {
                marginTop: 0,
                fontSize: 16,
                fontWeight: '600',
                color: '#1e293b',
              },
            },
          }}
          style={{
            borderRadius: 16,
          }}
        />

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner}>
                <Text style={styles.loadingText}>🔄</Text>
              </View>
              <Text style={styles.loadingLabel}>Loading calendar...</Text>
            </View>
          </View>
        )}

        {/* Selected Date Info */}
        <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateTitle}>
            {formatDate(new Date(selectedDate), 'pt-PT')}
          </Text>
          
          {getSelectedDateCollections().length === 0 ? (
            <Text style={styles.noCollectionText}>
              😴 Sem recolha neste dia
            </Text>
          ) : (
            <View>
              {getSelectedDateCollections().map((garbageType) => (
                <View key={garbageType.id} style={styles.collectionItem}>
                  <Text style={styles.collectionIcon}>
                    {getGarbageTypeIcon(garbageType.code)}
                  </Text>
                  <Text style={styles.collectionText}>
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
}
