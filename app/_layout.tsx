import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioManagerProvider } from './timerScreen/audioManagerTimer';
import SplashScreenComponent from './splashScreen';
import { StatusBar } from 'react-native';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <AudioManagerProvider>
                <StatusBar
                    barStyle="dark-content" // Adjust as needed: "light-content" or "dark-content"
                    backgroundColor="transparent" // Set if you want transparency
                    translucent={true} // Ensure status bar overlays the app content
                />
                <SplashScreenComponent>
                    <Slot />
                </SplashScreenComponent>
            </AudioManagerProvider>
        </SafeAreaProvider>
    );
}
