import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAudioManager } from './audioManager';

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useAudioManager();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
            setIsReady(true);
        }
    }, [isLoading]);

    if (!isReady) {
        return (
            <View style={styles.splashContainer}>
                <Text style={styles.splashText}>Loading...</Text>
            </View>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    splashText: {
        fontSize: 24,
        color: '#333',
    },
});

export default SplashScreenComponent;
