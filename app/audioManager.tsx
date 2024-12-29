import React, { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const bellFiles = [
    { name: 'No Sound', file: null },
    { name: 'Aura Chime', file: require('../assets/audio/bell/bell1.mp3') },
    { name: 'Zen Whisper', file: require('../assets/audio/bell/bell2.mp3') },
    { name: 'Celestial Ring', file: require('../assets/audio/bell/bell3.mp3') },
];

const ambianceFiles = [
    { name: 'No Sound', file: null },
    { name: 'Rain', file: require('../assets/audio/ambience/rain.mp3') },
    { name: 'Campfire', file: require('../assets/audio/ambience/campfire.mp3') },
    { name: 'Wind Chimes', file: require('../assets/audio/ambience/windChimes.mp3') },
];

type AudioMap = Record<string, any>;
type PreloadedSounds = Record<string, Audio.Sound | null>;

interface AudioContextProps {
    bells: AudioMap;
    ambiance: AudioMap;
    preloadedBells: PreloadedSounds;
    preloadedAmbiance: PreloadedSounds;
    isLoading: boolean;
}

const AudioContext = createContext<AudioContextProps | null>(null);

export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bells, setBells] = useState<AudioMap>({});
    const [ambiance, setAmbiance] = useState<AudioMap>({});
    const [preloadedBells, setPreloadedBells] = useState<PreloadedSounds>({});
    const [preloadedAmbiance, setPreloadedAmbiance] = useState<PreloadedSounds>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const preloadAllAudio = async () => {
            try {
                const tempPreloadedBells: PreloadedSounds = {};
                for (const bell of bellFiles) {
                    if (bell.file) {
                        const { sound } = await Audio.Sound.createAsync(bell.file);
                        tempPreloadedBells[bell.name] = sound;
                    } else {
                        tempPreloadedBells[bell.name] = null;
                    }
                }
                setPreloadedBells(tempPreloadedBells);

                const tempPreloadedAmbiance: PreloadedSounds = {};
                for (const amb of ambianceFiles) {
                    if (amb.file) {
                        const { sound } = await Audio.Sound.createAsync(amb.file);
                        tempPreloadedAmbiance[amb.name] = sound;
                    } else {
                        tempPreloadedAmbiance[amb.name] = null;
                    }
                }
                setPreloadedAmbiance(tempPreloadedAmbiance);
            } catch (error) {
                console.error('Error preloading audio:', error);
            } finally {
                setIsLoading(false);
            }
        };

        preloadAllAudio();
    }, []);

    return (
        <AudioContext.Provider value={{ bells, ambiance, preloadedBells, preloadedAmbiance, isLoading }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioManager = (): AudioContextProps => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioManager must be used within an AudioManagerProvider');
    }
    return context;
};
