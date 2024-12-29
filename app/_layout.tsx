// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioManagerProvider } from './audioManager'; // adjust path

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AudioManagerProvider>
        <Slot />
      </AudioManagerProvider>
    </SafeAreaProvider>
  );
}
