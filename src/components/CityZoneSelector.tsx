import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

interface SelectorItem {
  id: string;
  [key: string]: any;
}

interface CityZoneSelectorProps<T extends SelectorItem> {
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  getDisplayName: (item: T) => string;
  placeholder: string;
}

export function CityZoneSelector<T extends SelectorItem>({
  items,
  selectedId,
  onSelect,
  getDisplayName,
  placeholder,
}: CityZoneSelectorProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.id === selectedId);
  const displayText = selectedItem ? getDisplayName(selectedItem) : placeholder;

  const handleSelect = (item: T) => {
    onSelect(item.id);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: T }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`p-4 border-b border-gray-200 ${
        item.id === selectedId ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <Text className={`text-base ${
        item.id === selectedId ? 'text-blue-900 font-semibold' : 'text-gray-900'
      }`}>
        {getDisplayName(item)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <Text className={`text-base ${
          selectedItem ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {displayText}
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
              {placeholder}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-2"
            >
              <Text className="text-blue-600 font-semibold">Done</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

