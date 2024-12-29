import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';
import { useAudioManager } from '../audioManager'; // <-- Import your AudioManager hook

interface AmbianceOption {
  name: string; // We only need the name now
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
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Access the preloaded ambiance sounds from the AudioManager
  const { preloadedAmbiance } = useAudioManager();

  /**
   * Stop any currently playing ambiance preview.
   */
  const stopAllAudio = async () => {
    if (currentPlaying && preloadedAmbiance[currentPlaying]) {
      try {
        await preloadedAmbiance[currentPlaying].stopAsync();
        await preloadedAmbiance[currentPlaying].setPositionAsync(0);
      } catch (err) {
        console.warn('Error stopping ambiance audio:', err);
      }
    }
    setCurrentPlaying(null);
  };

  /**
   * Play preview for the selected ambiance sound.
   */
  const playPreviewSound = async (ambName: string) => {
    // Stop any currently playing preview
    await stopAllAudio();

    const soundObject = preloadedAmbiance[ambName];
    if (soundObject) {
      try {
        await soundObject.stopAsync();
        await soundObject.setPositionAsync(0);
        await soundObject.playAsync();
        setCurrentPlaying(ambName);
      } catch (err) {
        console.error('Error playing ambiance preview:', err);
        setCurrentPlaying(null);
      }
    }
  };

  /**
   * Select an ambiance, preview it.
   */
  const handleAmbianceSelection = async (optionName: string) => {
    setTempSelectedAmbiance(optionName);
    await playPreviewSound(optionName);
  };

  /**
   * Save the selection and notify parent with the selected ambiance sound.
   */
  const saveAmbianceSelection = async () => {
    const selectedSound = preloadedAmbiance[tempSelectedAmbiance] || null;
    onAmbianceChange(tempSelectedAmbiance, selectedSound);

    await stopAllAudio();
    setAmbianceModalVisible(false);
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={ambianceModalVisible}
        animationType="slide"
        onRequestClose={async () => {
          await stopAllAudio();
          setAmbianceModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={async () => {
            await stopAllAudio();
            setAmbianceModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { padding: MODAL_PADDING, width: modalWidth },
                ]}
              >
                <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                  {ambianceOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.modalOption,
                        { width: BOX_SIZE, height: BOX_SIZE },
                        tempSelectedAmbiance === option.name && styles.activeModalOption,
                      ]}
                      onPress={() => handleAmbianceSelection(option.name)}
                    >
                      <Text style={styles.modalOptionText}>{option.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={[styles.buttonContainer, { marginTop: BOX_MARGIN / 2 }]}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={async () => {
                      await stopAllAudio();
                      setAmbianceModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveAmbianceSelection}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity onPress={() => setAmbianceModalVisible(true)}>
        <Text style={styles.bodyText}>{tempSelectedAmbiance}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalOption: {
    borderRadius: 10,
    backgroundColor: theme.COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeModalOption: {
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: theme.COLORS.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: theme.COLORS.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    color: theme.COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
});

export default AmbianceSelection;
