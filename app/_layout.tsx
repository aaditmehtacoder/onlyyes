import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  const headerShown = useMemo(() => Platform.OS !== 'web', []);
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' }
        }}
      />
    </>
  );
}
