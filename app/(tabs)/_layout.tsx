import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      labelStyle={{
        color: DynamicColorIOS({
          dark: '#FFFFFF',
          light: '#1D1D1F',
        }),
        fontSize: 12,
        fontWeight: '500',
      }}
      tintColor="#007AFF"
      backgroundColor={DynamicColorIOS({
        dark: '#1C1C1E',
        light: '#F2F2F7',
      })}
    >
      <NativeTabs.Trigger name="index">
        <Label>{t('navigation.calendar', 'Calendar')}</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'calendar', selected: 'calendar.circle' }} />,
          android: (
            <Icon
              src={{
                default: <VectorIcon family={Ionicons} name="calendar-outline" />,
                selected: <VectorIcon family={Ionicons} name="calendar" />,
              }}
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>{t('navigation.settings', 'Settings')}</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'gearshape', selected: 'gearshape.circle' }} />,
          android: (
            <Icon
              src={{
                default: <VectorIcon family={Ionicons} name="settings-outline" />,
                selected: <VectorIcon family={Ionicons} name="settings" />,
              }}
            />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
