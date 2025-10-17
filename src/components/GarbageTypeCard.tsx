import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GarbageType } from '../types';

interface GarbageTypeCardProps {
  garbageType: GarbageType;
  compact?: boolean;
}

export function GarbageTypeCard({ garbageType, compact = false }: GarbageTypeCardProps) {
  const { t } = useTranslation();

  const getGarbageTypeName = (garbageType: GarbageType) => {
    switch (garbageType.code) {
      case 'papel':
        return t('garbage.papel');
      case 'embalagens':
        return t('garbage.embalagens');
      case 'bioresiduos':
        return t('garbage.bioresiduos');
      case 'indiferenciados':
        return t('garbage.indiferenciados');
      default:
        return garbageType.name_pt;
    }
  };

  const containerClass = compact 
    ? 'p-3 rounded-2xl' 
    : 'p-4 rounded-2xl';
  
  const textClass = compact 
    ? 'text-xs font-semibold' 
    : 'text-sm font-bold';

  return (
    <View 
      className={`${containerClass} shadow-sm border border-white/20`}
      style={{ backgroundColor: garbageType.color_hex }}
    >
      <Text 
        className={`${textClass} text-white text-center`}
        numberOfLines={compact ? 1 : 2}
      >
        {getGarbageTypeName(garbageType)}
      </Text>
    </View>
  );
}

