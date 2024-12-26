import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import AmbianceSelectionModal from './ambianceSelectionModal';

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

  useEffect(() => {
    const preloadSounds = async () => {
      const pool: { [key: string]: Audio.Sound | null } = {};
      for (const option of ambianceOptions) {
        if (option.sound) {
          try {
            const { sound } = await Audio.Sound.createAsync(option.sound);
            pool[option.name] = sound;
          } catch {
            pool[option.name] = null;
          }
        }
      }
      setAudioPool(pool);
    };

    preloadSounds();
    return () => {
      Object.values(audioPool).forEach(async (sound) => {
        if (sound) await sound.unloadAsync();
      });
    };
  }, [ambianceOptions]);

  const playPreviewSound = async (name: string) => {
    if (currentPlaying && audioPool[currentPlaying]) {
      await audioPool[currentPlaying]?.stopAsync();
    }
    const sound = audioPool[name];
    if (sound) {
      try {
        await sound.replayAsync();
        setCurrentPlaying(name);
      } catch {
        setCurrentPlaying(null);
      }
    }
  };

  const stopAllAudio = async () => {
    if (currentPlaying && audioPool[currentPlaying]) {
      await audioPool[currentPlaying]?.stopAsync();
    }
    setCurrentPlaying(null);
  };

  const handleAmbianceSelection = async (option: AmbianceOption) => {
    setTempSelectedAmbiance(option.name);
    if (option.sound) {
      await playPreviewSound(option.name);
    }
  };

  const saveAmbianceSelection = async () => {
    const chosenOption = ambianceOptions.find((option) => option.name === tempSelectedAmbiance);
    onAmbianceChange(tempSelectedAmbiance, chosenOption?.sound || null);
    await stopAllAudio();
    setAmbianceModalVisible(false);
  };

  return (
    <>
      <AmbianceSelectionModal
        visible={ambianceModalVisible}
        onCloseModal={async () => {
          await stopAllAudio();
          setAmbianceModalVisible(false);
        }}
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

const styles = StyleSheet.create({
  bodyText: { fontSize: 14, color: '#000', textAlign: 'left' },
});

export default AmbianceSelection;
