// ambianceSelection.tsx

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import AmbianceSelectionModal from './ambianceSelectionModal';

/* ----------------------------------- TYPES ----------------------------------- */
interface AmbianceOption {
  name: string;
  sound: any;
}

interface AmbianceSelectionProps {
  ambianceOptions: AmbianceOption[];
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onAmbianceChange: (selectedAmbiance: string, ambianceSound: any) => void;
}

const AmbianceSelection: React.FC<AmbianceSelectionProps> = ({
  ambianceOptions,
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onAmbianceChange,
}) => {
  const [ambianceModalVisible, setAmbianceModalVisible] = useState(false);
  const [tempSelectedAmbiance, setTempSelectedAmbiance] = useState('No Sound');
  const [audioPool, setAudioPool] = useState<{ [key: string]: Audio.Sound | null }>({});
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Preload audio on component mount
  useEffect(() => {
    const preloadSounds = async () => {
      const pool: { [key: string]: Audio.Sound | null } = {};
      for (const option of ambianceOptions) {
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
  }, [ambianceOptions]);

  const handleAmbianceSelection = async (option: AmbianceOption) => {
    if (currentPlaying && currentPlaying !== option.name) {
      await stopCurrentPlayingAudio();
    }

    setTempSelectedAmbiance(option.name);

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

  const saveAmbianceSelection = async () => {
    const chosenOption = ambianceOptions.find((option) => option.name === tempSelectedAmbiance);
    onAmbianceChange(tempSelectedAmbiance, chosenOption?.sound || null);
    setAmbianceModalVisible(false);
    await stopCurrentPlayingAudio();
  };

  const handleCloseAmbianceModal = async () => {
    setAmbianceModalVisible(false);
    await stopCurrentPlayingAudio();
  };

  return (
    <>
      <AmbianceSelectionModal
        visible={ambianceModalVisible}
        onCloseModal={handleCloseAmbianceModal}
        ambianceOptions={ambianceOptions}
        tempSelectedAmbiance={tempSelectedAmbiance}
        onAmbianceSelect={handleAmbianceSelection}
        onSave={saveAmbianceSelection}
        BOX_SIZE={BOX_SIZE}
        BOX_MARGIN={BOX_MARGIN}
        MODAL_PADDING={MODAL_PADDING}
        modalWidth={modalWidth}
      />

      <TouchableOpacity onPress={() => setAmbianceModalVisible(true)}>
        <Text style={styles.bodyText}>{tempSelectedAmbiance}</Text>
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

export default AmbianceSelection;
