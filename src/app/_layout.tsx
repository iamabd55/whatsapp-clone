import '../../global.css';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '@/components/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await ExpoSplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();

    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLogin ? <Redirect href={"/(main)"}/> : <Redirect href={"/(auth)"}/>}
    </Stack>
  );
};

export default RootLayout;
