// audioManagerAfirmasi.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

/**
 * Example: We'll just have one Affirmation audio file, or you can expand.
 */
const affirmations = [
  { name: 'Bell1', file: require('../assets/audio/afirmasi/bell1.mp3') },
  // Add more Affirmation audio files as needed
];

type AudioMap = Record<string, any>;
type PreloadedSounds = Record<string, Audio.Sound | null>;

interface AfirmasiAudioContextProps {
  affirmations: AudioMap;
  preloadedAffirmations: PreloadedSounds;
  isLoading: boolean;
}

const AfirmasiAudioContext = createContext<AfirmasiAudioContextProps | null>(null);

export const AudioManagerAfirmasiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [afirmasiMap, setAfirmasiMap] = useState<AudioMap>({});
  const [preloadedAffirmations, setPreloadedAffirmations] = useState<PreloadedSounds>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadAllAfirmasiAudio = async () => {
      try {
        const tempPreloaded: PreloadedSounds = {};
        for (const af of affirmations) {
          if (af.file) {
            const { sound } = await Audio.Sound.createAsync(af.file);
            tempPreloaded[af.name] = sound;
          } else {
            tempPreloaded[af.name] = null;
          }
        }
        setPreloadedAffirmations(tempPreloaded);
      } catch (error) {
        console.error('Error preloading afirmasi audio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadAllAfirmasiAudio();
  }, []);

  return (
    <AfirmasiAudioContext.Provider
      value={{ affirmations: afirmasiMap, preloadedAffirmations, isLoading }}
    >
      {children}
    </AfirmasiAudioContext.Provider>
  );
};

export const useAudioManagerAfirmasi = (): AfirmasiAudioContextProps => {
  const context = useContext(AfirmasiAudioContext);
  if (!context) {
    throw new Error('useAudioManagerAfirmasi must be used within an AudioManagerAfirmasiProvider');
  }
  return context;
};
