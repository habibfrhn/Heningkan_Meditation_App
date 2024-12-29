import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

/**
 * Define the audio assets you want to preload. 
 * We separate them into categories (bells, ambience, etc.) 
 * but you can organize them however fits your needs.
 */
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
  ;

// Types for clarity
type AudioMap = Record<string, any>; // We'll store either 'null' or a 'require' reference
type PreloadedSounds = Record<string, Audio.Sound | null>;

/**
 * Create a Context to store all preloaded audio references
 */
interface AudioContextProps {
  bells: AudioMap;
  ambiance: AudioMap;
  preloadedBells: PreloadedSounds;
  preloadedAmbiance: PreloadedSounds;
}

const AudioContext = createContext<AudioContextProps | null>(null);

/**
 * The provider component that loads audio at app startup
 */
export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Store the raw require references
  const [bells, setBells] = useState<AudioMap>({});
  const [ambiance, setAmbiance] = useState<AudioMap>({});

  // Store the *preloaded* Audio.Sound instances
  const [preloadedBells, setPreloadedBells] = useState<PreloadedSounds>({});
  const [preloadedAmbiance, setPreloadedAmbiance] = useState<PreloadedSounds>({});

  // On mount, collect and preload all audio
  useEffect(() => {
    // Collect raw references in state
    const collectedBells: AudioMap = {};
    bellFiles.forEach((bell) => {
      collectedBells[bell.name] = bell.file;
    });
    setBells(collectedBells);

    const collectedAmbiance: AudioMap = {};
    ambianceFiles.forEach((amb) => {
      collectedAmbiance[amb.name] = amb.file;
    });
    setAmbiance(collectedAmbiance);

    // Preload them
    const preloadAllAudio = async () => {
      // Preload Bells
      const tempPreloadedBells: PreloadedSounds = {};
      for (const bell of bellFiles) {
        if (bell.file) {
          // Create a sound object but don't play it yet
          const { sound } = await Audio.Sound.createAsync(bell.file, {
            shouldPlay: false,
            isLooping: false,
          });
          tempPreloadedBells[bell.name] = sound;
        } else {
          tempPreloadedBells[bell.name] = null;
        }
      }
      setPreloadedBells(tempPreloadedBells);

      // Preload Ambiance
      const tempPreloadedAmbiance: PreloadedSounds = {};
      for (const amb of ambianceFiles) {
        if (amb.file) {
          const { sound } = await Audio.Sound.createAsync(amb.file, {
            shouldPlay: false,
            isLooping: true, // ambiance often loops
          });
          tempPreloadedAmbiance[amb.name] = sound;
        } else {
          tempPreloadedAmbiance[amb.name] = null;
        }
      }
      setPreloadedAmbiance(tempPreloadedAmbiance);
    };

    preloadAllAudio().catch((error) => {
      console.error('Error preloading audio:', error);
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        bells,
        ambiance,
        preloadedBells,
        preloadedAmbiance,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

/**
 * Hook to quickly use the AudioManager context
 */
export const useAudioManager = (): AudioContextProps => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioManager must be used within an AudioManagerProvider');
  }
  return context;
};
