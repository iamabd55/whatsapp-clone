import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COUNTRIES, Country } from '@/constants/countries';

interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCountry?: Country | null;
}

export default function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}: CountryPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }
    const query = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setSearchQuery('');
    onClose();
  };

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry?.code === item.code;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
        className={`flex-row items-center justify-between px-6 py-3.5 border-b border-gray-100 dark:border-gray-800 ${
          isSelected ? 'bg-gray-100 dark:bg-gray-800/60' : ''
        }`}
      >
        <View className="flex-row items-center flex-1 mr-4">
          <Text className="text-2xl mr-3">{item.flag}</Text>
          <Text className="text-base text-[#111B21] dark:text-[#E9EDEF] font-medium flex-1">
            {item.name}
          </Text>
        </View>
        <Text className="text-base text-whatsapp-lightGreen font-semibold">
          {item.dialCode}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-whatsapp-darkBackground">
        <StatusBar style={isDark ? 'light' : 'dark'} />

        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="p-2 mr-2"
          >
            <Text className="text-xl text-[#111B21] dark:text-[#E9EDEF]">
              ✕
            </Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-[#111B21] dark:text-[#E9EDEF] flex-1">
            Choose a country
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-2 border-b border-gray-100 dark:border-gray-800/80">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-800/80 rounded-lg px-3 py-2">
            <Text className="text-gray-400 mr-2 text-base">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search country or code"
              placeholderTextColor="#8696A0"
              className="flex-1 text-base text-[#111B21] dark:text-[#E9EDEF] py-0"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-gray-400 text-sm ml-2">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List of Countries */}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          renderItem={renderCountryItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Text className="text-sm text-gray-400">
                No country found matching "{searchQuery}"
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
