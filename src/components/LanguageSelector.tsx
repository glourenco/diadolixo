import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Language {
  code: 'pt' | 'en' | 'es';
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  selectedLanguage: 'pt' | 'en' | 'es';
  onLanguageChange: (language: 'pt' | 'en' | 'es') => void;
}

const languages: Language[] = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  const handleSelect = (language: Language) => {
    onLanguageChange(language.code);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`p-4 border-b border-gray-200 ${
        item.code === selectedLanguage ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className={`text-base ${
            item.code === selectedLanguage ? 'text-blue-900 font-semibold' : 'text-gray-900'
          }`}>
            {item.nativeName}
          </Text>
          <Text className={`text-sm ${
            item.code === selectedLanguage ? 'text-blue-700' : 'text-gray-600'
          }`}>
            {item.name}
          </Text>
        </View>
        {item.code === selectedLanguage && (
          <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <Text className="text-base text-gray-900">
          {selectedLang?.nativeName || t('settings.language.placeholder')}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">
              {t('settings.language.title')}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-2"
            >
              <Text className="text-blue-600 font-semibold">Done</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

