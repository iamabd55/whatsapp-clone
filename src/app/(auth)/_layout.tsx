import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 220,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationMatchesGesture: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="terms_agree" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="verify_otp" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
};

export default AuthLayout;
