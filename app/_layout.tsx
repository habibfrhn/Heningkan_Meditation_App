import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
