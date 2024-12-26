import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import BellSelectionModal from './bellSelectionModal';

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

  useEffect(() => {
    const preloadSounds = async () => {
      const pool: { [key: string]: Audio.Sound | null } = {};
      for (const option of bellOptions) {
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
  }, [bellOptions]);

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

  const handleBellSelection = async (option: BellOption) => {
    setTempSelectedBell(option.name);
    if (option.sound) {
      await playPreviewSound(option.name);
    }
  };

  const saveBellSelection = async () => {
    const chosenOption = bellOptions.find((option) => option.name === tempSelectedBell);
    onBellChange(tempSelectedBell, chosenOption?.sound || null);
    await stopAllAudio();
    setBellModalVisible(false);
  };

  return (
    <>
      <BellSelectionModal
        visible={bellModalVisible}
        onCloseModal={async () => {
          await stopAllAudio();
          setBellModalVisible(false);
        }}
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

const styles = StyleSheet.create({
  bodyText: { fontSize: 14, color: '#000', textAlign: 'left' },
});

export default BellSelection;
