import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SuviStateProvider, useSuvi } from '@/context/SuviStateContext';

// Prevent splash from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

function NavigationGuard() {
  const { state } = useSuvi();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inOnboarding = segments[0] === '(onboarding)';
    const isOnboarded = state.profile.isOnboarded;

    if (!isOnboarded && !inOnboarding) {
      // Not onboarded yet → redirect to onboarding welcome
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && inOnboarding) {
      // Already onboarded → redirect to main tabs
      router.replace('/(tabs)');
    }
  }, [state.profile.isOnboarded, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'BodoniModa': require('@/assets/fonts/BodoniModa-Medium.ttf'),
    'BodoniModa-SemiBold': require('@/assets/fonts/BodoniModa-SemiBold.ttf'),
    'BodoniModa-Bold': require('@/assets/fonts/BodoniModa-Bold.ttf'),
    'Lexend': require('@/assets/fonts/Lexend-Regular.ttf'),
    'Lexend-Light': require('@/assets/fonts/Lexend-Light.ttf'),
    'Lexend-Medium': require('@/assets/fonts/Lexend-Medium.ttf'),
    'Lexend-SemiBold': require('@/assets/fonts/Lexend-SemiBold.ttf'),
    'Lexend-Bold': require('@/assets/fonts/Lexend-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SuviStateProvider>
      <StatusBar style="dark" />
      <NavigationGuard />
    </SuviStateProvider>
  );
}
