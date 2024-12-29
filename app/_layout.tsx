import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioManagerProvider } from './audioManager';
import SplashScreenComponent from './splashScreen';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <AudioManagerProvider>
                <SplashScreenComponent>
                    <Slot />
                </SplashScreenComponent>
            </AudioManagerProvider>
        </SafeAreaProvider>
    );
}
