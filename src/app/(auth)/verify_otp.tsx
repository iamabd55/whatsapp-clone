import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import OTPInput from '@codsod/react-native-otp-input';

const RESEND_TIMEOUT = 56; // 56 seconds as shown in reference design
const INVALID_DEMO_CODE = '7387'; // Code shown in reference image 3 triggering error
const VALID_DEMO_CODE = '4729'; // Code shown in reference image 4

const maskPhoneNumber = (rawPhone?: string): string => {
  if (!rawPhone) {
    return '+91 11******44';
  }

  // Remove spaces
  const clean = rawPhone.replace(/\s+/g, '');
  if (clean.length < 8) {
    return clean;
  }

  // Extract prefix (first 5-6 characters, e.g. +91 11) and suffix (last 2 digits)
  const isPlus = clean.startsWith('+');
  const startIndex = isPlus ? 1 : 0;
  const countryAndPrefix = clean.slice(0, startIndex + 4);
  const suffix = clean.slice(-2);

  return `${isPlus ? '+' : ''}${countryAndPrefix.replace('+', '')}******${suffix}`;
};

const VerifyOtp = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State
  const [otpCode, setOtpCode] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(RESEND_TIMEOUT);

  // Masked phone display
  const maskedPhone = maskPhoneNumber(params.phone);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle OTP change from @codsod/react-native-otp-input
  const handleOtpChange = (code: string) => {
    setOtpCode(code);
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
  };

  // Handle Resend Code
  const handleResendCode = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_TIMEOUT);
    setHasError(false);
    setErrorMessage('');
  };

  // Handle Verify button press
  const handleVerify = () => {
    if (otpCode.length < 4 || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    // Simulate OTP verification (pure frontend, backend to be added later)
    setTimeout(() => {
      if (otpCode === INVALID_DEMO_CODE) {
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('Invalid password');
      } else {
        setIsLoading(false);
        // Successful verification -> navigate to main app
        router.replace('/(main)');
      }
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-whatsapp-darkBackground">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-between px-6 py-4"
      >
        {/* Top Header & OTP Content */}
        <View className="w-full">
          {/* Header Row: Back Arrow + Title */}
          <View className="flex-row items-center mt-2 mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="mr-3"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Text className="text-2xl text-[#111B21] dark:text-[#E9EDEF] font-bold">
                ←
              </Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-[#111B21] dark:text-[#E9EDEF]">
              Enter OTP Code
            </Text>
          </View>

          {/* Subtitle with masked phone number */}
          <View className="items-center mb-8">
            <Text className="text-xs text-[#667781] dark:text-[#8696A0] text-center">
              Code has been send to {maskedPhone}
            </Text>
          </View>

          {/* OTP Input using @codsod/react-native-otp-input */}
          <View className="items-center justify-center my-2">
            <OTPInput
              length={4}
              onOtpComplete={handleOtpChange}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
              }}
              inputStyle={{
                width: 60,
                height: 60,
                borderWidth: 1.5,
                borderColor: hasError ? '#EF4444' : isDark ? '#374151' : '#D1D5DB',
                borderRadius: 16,
                marginHorizontal: 4,
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                color: isDark ? '#E9EDEF' : '#111B21',
                backgroundColor: isDark ? '#1F2C34' : '#FFFFFF',
              } as any}
            />
          </View>

          {/* Error Message Pill (matches image 3) */}
          {hasError && (
            <View className="items-center mt-4">
              <View className="flex-row items-center bg-red-100 dark:bg-red-950/60 px-3 py-1.5 rounded-md">
                {/* Red Exclamation Icon */}
                <View className="w-3.5 h-3.5 rounded-full bg-red-600 items-center justify-center mr-1.5">
                  <Text className="text-[10px] text-white font-bold leading-none">!</Text>
                </View>
                <Text className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {errorMessage}
                </Text>
              </View>
            </View>
          )}

          {/* Resend Code in countdown / Clickable Resend */}
          <View className="items-center mt-6">
            {countdown > 0 ? (
              <Text className="text-xs text-[#667781] dark:text-[#8696A0]">
                Resend Code in{' '}
                <Text className="text-whatsapp-lightGreen font-semibold">
                  {countdown} s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode}>
                <Text className="text-xs text-whatsapp-lightGreen font-bold">
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Verify Button */}
        <View className="w-full pb-6 items-center">
          <TouchableOpacity
            onPress={handleVerify}
            disabled={otpCode.length < 4 || isLoading}
            activeOpacity={0.8}
            className={`w-full py-3.5 rounded-full items-center justify-center ${
              otpCode.length === 4
                ? 'bg-whatsapp-lightGreen'
                : 'bg-whatsapp-lightGreen/50'
            }`}
          >
            <Text className="text-base font-semibold text-white">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay (matches image 5) */}
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="p-6 rounded-2xl items-center justify-center">
            <ActivityIndicator size="large" color="#00A884" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerifyOtp;
