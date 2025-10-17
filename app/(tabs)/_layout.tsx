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
          dark: 'white',
          light: 'black',
        }),
      }}
      tintColor="#3B82F6"
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
