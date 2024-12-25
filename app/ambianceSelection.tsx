// ambianceSelection.tsx

import React, { useState } from 'react';
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
  // Ambiance states
  const [ambianceModalVisible, setAmbianceModalVisible] = useState<boolean>(false);
  const [tempSelectedAmbiance, setTempSelectedAmbiance] = useState<string>('No Sound');
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);

  const handleAmbianceSelection = (option: AmbianceOption) => {
    setTempSelectedAmbiance(option.name);
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
        console.error('Error playing ambiance preview sound:', err);
      }
    }
  };

  const saveAmbianceSelection = () => {
    const chosenOption = ambianceOptions.find((option) => option.name === tempSelectedAmbiance);
    onAmbianceChange(tempSelectedAmbiance, chosenOption?.sound || null);
    setAmbianceModalVisible(false);
    if (previewSound) {
      previewSound.stopAsync();
      previewSound.unloadAsync();
      setPreviewSound(null);
    }
  };

  const handleCloseAmbianceModal = async () => {
    setAmbianceModalVisible(false);
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }
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
    color: '#000', // Assuming theme.COLORS.black is '#000'
    textAlign: 'left',
  },
});

export default AmbianceSelection;
