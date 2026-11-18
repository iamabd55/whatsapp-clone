import React from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import imagePath from '@/constants/imagePath';
import Button from '@/components/atoms/Button';

const TermsAgree = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAgreeAndContinue = () => {
    router.push('/(auth)/login');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.whatsapp.com/legal/privacy-policy');
  };

  const openTerms = () => {
    Linking.openURL('https://www.whatsapp.com/legal/terms-of-service');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-whatsapp-darkBackground justify-between items-center px-6 py-4">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Main Container: Title + Doodle + Legal Text + Button */}
      <View className="w-full items-center flex-1 justify-around py-2">
        {/* Welcome Title */}
        <View className="items-center mt-2 mb-2">
          <Text className="text-2xl font-bold text-[#111B21] dark:text-[#E9EDEF] text-center">
            Welcome to WhatsApp
          </Text>
        </View>

        {/* Doodle Illustration */}
        <View className="items-center justify-center my-2">
          <Image
            source={isDark ? imagePath.welcome_dark : imagePath.welcome}
            className="w-64 h-64 max-w-[68vw] max-h-[68vw]"
            resizeMode="contain"
          />
        </View>

        {/* Legal Text Paragraph & Button */}
        <View className="w-full items-center">
          <Text className="text-center text-xs text-[#667781] dark:text-[#8696A0] leading-5 px-6 mb-6">
            Read our{' '}
            <Text
              onPress={openPrivacyPolicy}
              className="text-[#0C42CC] dark:text-[#53BDEB]"
            >
              Privacy Policy
            </Text>
            . Tap "Agree and continue" to accept the{' '}
            <Text
              onPress={openTerms}
              className="text-[#0C42CC] dark:text-[#53BDEB]"
            >
              Terms of Service
            </Text>
            .
          </Text>

          {/* Reusable Agree and Continue Button */}
          <Button
            title="Agree and continue"
            onPress={handleAgreeAndContinue}
          />
        </View>
      </View>

      {/* Footer Container: from FACEBOOK */}
      <View className="items-center pb-6">
        <Text className="text-[11px] text-[#8696A0] tracking-wider mb-1 uppercase">
          from
        </Text>
        <Text className="text-sm font-semibold tracking-[3px] text-[#111B21] dark:text-[#E9EDEF] uppercase">
          Facebook
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default TermsAgree;
