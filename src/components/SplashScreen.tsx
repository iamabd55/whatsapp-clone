import React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import imagePath from '@/constants/imagePath';

export default function SplashScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className={`flex-1 items-center justify-between ${isDark ? 'bg-whatsapp-darkBackground' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 justify-center items-center">
        <Image
          source={imagePath.logo}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>
      <View className="items-center mb-6">
        <Text className="text-xs text-[#8696A0] tracking-wider mb-1">from</Text>
        <Text className={`text-base font-bold tracking-widest uppercase ${isDark ? 'text-whatsapp-light' : 'text-whatsapp-lightGreen'}`}>
          Meta
        </Text>
      </View>
    </SafeAreaView>
  );
}
