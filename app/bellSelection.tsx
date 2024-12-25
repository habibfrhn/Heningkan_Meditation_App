// bellSelection.tsx

import React, { useState } from 'react';
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
  // Bell states
  const [bellModalVisible, setBellModalVisible] = useState<boolean>(false);
  const [tempSelectedBell, setTempSelectedBell] = useState<string>('Aura Chime');
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);

  const handleBellSelection = (option: BellOption) => {
    setTempSelectedBell(option.name);
    if (option.sound) {
      playPreviewSound(option.sound);
    } else if (previewSound) {
      previewSound.stopAsync();
    }
  };

  const playPreviewSound = async (soundAsset: any) => {
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }

    if (soundAsset) {
      try {
        const { sound: newPreviewSound } = await Audio.Sound.createAsync(soundAsset);
        setPreviewSound(newPreviewSound);
        await newPreviewSound.playAsync();

        setTimeout(async () => {
          if (newPreviewSound) {
            await newPreviewSound.stopAsync();
            await newPreviewSound.unloadAsync();
            setPreviewSound(null);
          }
        }, 10000);

        newPreviewSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            newPreviewSound.unloadAsync();
            setPreviewSound(null);
          }
        });
      } catch (err) {
        console.error('Error playing bell preview sound:', err);
      }
    }
  };

  const saveBellSelection = () => {
    const chosenOption = bellOptions.find((option) => option.name === tempSelectedBell);
    onBellChange(tempSelectedBell, chosenOption?.sound || null);
    setBellModalVisible(false);
    if (previewSound) {
      previewSound.stopAsync();
      previewSound.unloadAsync();
      setPreviewSound(null);
    }
  };

  const handleCloseBellModal = async () => {
    setBellModalVisible(false);
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }
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
    color: '#000', // Assuming theme.COLORS.black is '#000'
    textAlign: 'left',
  },
});

export default BellSelection;
