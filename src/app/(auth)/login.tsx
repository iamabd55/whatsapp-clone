import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useColorScheme,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { COUNTRIES, Country, DEFAULT_COUNTRY } from '@/constants/countries';
import CountryPickerModal from '@/components/molecules/CountryPickerModal';
import Button from '@/components/atoms/Button';

const Login = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [callingCode, setCallingCode] = useState<string>(
    DEFAULT_COUNTRY.dialCode.replace('+', '')
  );
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  // When a country is selected from the picker modal
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCallingCode(country.dialCode.replace('+', ''));
  };

  // When user manually types into the calling code field
  const handleCallingCodeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setCallingCode(cleaned);

    if (cleaned) {
      const match = COUNTRIES.find((c) => c.dialCode === `+${cleaned}`);
      if (match) {
        setSelectedCountry(match);
      }
    }
  };

  // When user types the local phone number
  const handlePhoneNumberChange = (text: string) => {
    // Keep numbers and spaces
    const cleaned = text.replace(/[^0-9 ]/g, '');
    setPhoneNumber(cleaned);
  };

  // Handle Menu Action
  const handleMenuPress = () => {
    Alert.alert('Help', 'WhatsApp requires your phone number to send a verification code.', [
      { text: 'OK' },
    ]);
  };

  // Handle "What's my number?"
  const handleWhatsMyNumber = () => {
    Alert.alert(
      "What's my number?",
      'Go to your phone Settings > About Phone (or SIM cards & mobile networks) to find your phone number.',
      [{ text: 'OK' }]
    );
  };

  // Handle "NEXT" button tap
  const handleNext = () => {
    const cleanDigits = phoneNumber.replace(/\s+/g, '');

    if (!callingCode) {
      Alert.alert('Invalid Country Code', 'Please enter a valid country calling code.');
      return;
    }

    if (!cleanDigits) {
      Alert.alert('Please enter your phone number', 'Phone number cannot be empty.');
      return;
    }

    if (cleanDigits.length < 6) {
      Alert.alert(
        'Phone number too short',
        `The phone number you entered is too short for ${selectedCountry.name}.`
      );
      return;
    }

    const fullNumber = `+${callingCode} ${phoneNumber.trim()}`;

    // WhatsApp-style confirmation dialog
    Alert.alert(
      'You entered the phone number:',
      `${fullNumber}\n\nIs this OK, or would you like to edit the number?`,
      [
        {
          text: 'Edit',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: '/(auth)/verify_otp',
              params: { phone: `+${callingCode}${cleanDigits}` },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-whatsapp-darkBackground">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-between px-6 py-4"
        >
          {/* Top Header & Form Container */}
          <View className="items-center w-full">
            {/* Header: Title + 3-Dot Menu */}
            <View className="w-full flex-row items-center justify-between mt-2 mb-6">
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(auth)');
                  }
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-6 items-center"
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Text className="text-xl text-[#111B21] dark:text-[#E9EDEF] font-bold">
                  ←
                </Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold text-[#111B21] dark:text-[#E9EDEF] text-center">
                Enter your phone number
              </Text>
              <TouchableOpacity
                onPress={handleMenuPress}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-6 items-center"
              >
                <Text className="text-xl text-[#111B21] dark:text-[#E9EDEF] font-bold">
                  ⋮
                </Text>
              </TouchableOpacity>
            </View>

            {/* Subtitle Description */}
            <Text className="text-center text-xs text-[#111B21] dark:text-[#8696A0] leading-5 px-6 mb-8">
              WhatsApp will need to verify your phone number.{' '}
              <Text
                onPress={handleWhatsMyNumber}
                className="text-[#0C42CC] dark:text-[#53BDEB]"
              >
                What's my number?
              </Text>
            </Text>

            {/* Country Selector Dropdown */}
            <TouchableOpacity
              onPress={() => setIsPickerVisible(true)}
              activeOpacity={0.7}
              className="w-3/4 max-w-[280px] pb-2 border-b-2 border-whatsapp-lightGreen flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <Text className="text-xl mr-2">{selectedCountry.flag}</Text>
                <Text
                  className="text-base text-[#111B21] dark:text-[#E9EDEF] font-medium"
                  numberOfLines={1}
                >
                  {selectedCountry.name}
                </Text>
              </View>
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                ▼
              </Text>
            </TouchableOpacity>

            {/* Phone Input Row */}
            <View className="w-3/4 max-w-[280px] flex-row items-center gap-3 mt-4">
              {/* Country Code Input */}
              <View className="w-20 pb-1.5 border-b-2 border-whatsapp-lightGreen flex-row items-center">
                <Text className="text-base text-[#111B21] dark:text-[#E9EDEF] font-semibold mr-1">
                  +
                </Text>
                <TextInput
                  value={callingCode}
                  onChangeText={handleCallingCodeChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  className="flex-1 text-base text-[#111B21] dark:text-[#E9EDEF] font-medium py-0"
                />
              </View>

              {/* Local Phone Number Input */}
              <View className="flex-1 pb-1.5 border-b-2 border-whatsapp-lightGreen">
                <TextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  placeholder="phone number"
                  placeholderTextColor="#8696A0"
                  maxLength={15}
                  className="text-base text-[#111B21] dark:text-[#E9EDEF] font-medium py-0"
                  autoFocus={false}
                />
              </View>
            </View>

            {/* Disclaimer Text */}
            <Text className="text-[11px] text-[#8696A0] text-center mt-4">
              Carrier charges may apply
            </Text>
          </View>

          {/* Bottom NEXT Button */}
          <View className="w-full items-center pb-6">
            <Button
              title="NEXT"
              onPress={handleNext}
              className="w-24 max-w-none py-2.5 px-3 rounded-sm"
              textClassName="text-sm font-semibold tracking-wider"
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Searchable Country Picker Modal */}
      <CountryPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry}
      />
    </SafeAreaView>
  );
};

export default Login;
