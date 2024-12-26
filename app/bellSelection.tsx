// bellSelection.tsx

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import BellSelectionModal from './bellSelectionModal';

/* ----------------------------------- TYPES ----------------------------------- */
interface BellOption {
  name: string;
  sound: any;
}

interface BellSelectionProps {
  bellOptions: BellOption[];
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onBellChange: (selectedBell: string, bellSound: any) => void;
}

const BellSelection: React.FC<BellSelectionProps> = ({
  bellOptions,
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onBellChange,
}) => {
  const [bellModalVisible, setBellModalVisible] = useState(false);
  const [tempSelectedBell, setTempSelectedBell] = useState('Aura Chime');
  const [audioPool, setAudioPool] = useState<{ [key: string]: Audio.Sound | null }>({});
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Preload audio on component mount
  useEffect(() => {
    const preloadSounds = async () => {
      const pool: { [key: string]: Audio.Sound | null } = {};
      for (const option of bellOptions) {
        if (option.sound) {
          try {
            const { sound } = await Audio.Sound.createAsync(option.sound);
            pool[option.name] = sound;
          } catch (err) {
            console.error(`Error preloading sound for ${option.name}:`, err);
            pool[option.name] = null;
          }
        }
      }
      setAudioPool(pool);
    };

    preloadSounds();

    // Cleanup on unmount
    return () => {
      Object.values(audioPool).forEach(async (sound) => {
        if (sound) {
          await sound.unloadAsync();
        }
      });
    };
  }, [bellOptions]);

  const handleBellSelection = async (option: BellOption) => {
    if (currentPlaying && currentPlaying !== option.name) {
      await stopCurrentPlayingAudio();
    }

    setTempSelectedBell(option.name);

    if (option.sound && audioPool[option.name]) {
      playPreviewSound(option.name);
    }
  };

  const playPreviewSound = async (name: string) => {
    const sound = audioPool[name];
    if (sound) {
      try {
        setCurrentPlaying(name);
        await sound.playAsync();
      } catch (err) {
        console.error(`Error playing sound ${name}:`, err);
      }
    }
  };

  const stopCurrentPlayingAudio = async () => {
    if (currentPlaying && audioPool[currentPlaying]) {
      try {
        const sound = audioPool[currentPlaying];
        if (sound) {
          await sound.stopAsync();
        }
        setCurrentPlaying(null);
      } catch (err) {
        console.error(`Error stopping sound ${currentPlaying}:`, err);
      }
    }
  };

  const saveBellSelection = async () => {
    const chosenOption = bellOptions.find((option) => option.name === tempSelectedBell);
    onBellChange(tempSelectedBell, chosenOption?.sound || null);
    setBellModalVisible(false);
    await stopCurrentPlayingAudio();
  };

  const handleCloseBellModal = async () => {
    setBellModalVisible(false);
    await stopCurrentPlayingAudio();
  };

  return (
    <>
      <BellSelectionModal
        visible={bellModalVisible}
        onCloseModal={handleCloseBellModal}
        bellOptions={bellOptions}
        tempSelectedBell={tempSelectedBell}
        onBellSelect={handleBellSelection}
        onSave={saveBellSelection}
        BOX_SIZE={BOX_SIZE}
        BOX_MARGIN={BOX_MARGIN}
        MODAL_PADDING={MODAL_PADDING}
        modalWidth={modalWidth}
      />

      <TouchableOpacity onPress={() => setBellModalVisible(true)}>
        <Text style={styles.bodyText}>{tempSelectedBell}</Text>
      </TouchableOpacity>
    </>
  );
};

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  bodyText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
});

export default BellSelection;
