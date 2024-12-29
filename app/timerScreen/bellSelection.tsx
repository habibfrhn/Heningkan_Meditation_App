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

interface BellOption {
  name: string; // We only need the name now (no direct sound references)
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
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Access the preloaded bell sounds from the AudioManager
  const { preloadedBells } = useAudioManager();

  /**
   * Stop the currently playing bell (if any).
   */
  const stopAllAudio = async () => {
    if (currentPlaying && preloadedBells[currentPlaying]) {
      try {
        await preloadedBells[currentPlaying].stopAsync();
        await preloadedBells[currentPlaying].setPositionAsync(0);
      } catch (err) {
        console.warn('Error stopping audio:', err);
      }
    }
    setCurrentPlaying(null);
  };

  /**
   * Play preview sound for a selected bell.
   */
  const playPreviewSound = async (bellName: string) => {
    // Stop the currently playing sound first
    await stopAllAudio();

    const soundObject = preloadedBells[bellName];
    if (soundObject) {
      try {
        // Rewind and play
        await soundObject.stopAsync();
        await soundObject.setPositionAsync(0);
        await soundObject.playAsync();
        setCurrentPlaying(bellName);
      } catch (err) {
        console.error('Error playing preview sound:', err);
        setCurrentPlaying(null);
      }
    }
  };

  /**
   * User clicks on a bell option to preview it.
   */
  const handleBellSelection = async (optionName: string) => {
    setTempSelectedBell(optionName);
    await playPreviewSound(optionName);
  };

  /**
   * Save the currently selected bell and notify parent via `onBellChange`.
   */
  const saveBellSelection = async () => {
    // We pass the *string* name and the associated preloaded sound object
    const selectedSound = preloadedBells[tempSelectedBell] || null;
    onBellChange(tempSelectedBell, selectedSound);

    await stopAllAudio();
    setBellModalVisible(false);
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={bellModalVisible}
        animationType="slide"
        onRequestClose={async () => {
          await stopAllAudio();
          setBellModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={async () => {
            await stopAllAudio();
            setBellModalVisible(false);
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
                  {bellOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.modalOption,
                        { width: BOX_SIZE, height: BOX_SIZE },
                        tempSelectedBell === option.name && styles.activeModalOption,
                      ]}
                      onPress={() => handleBellSelection(option.name)}
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
                      setBellModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveBellSelection}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity onPress={() => setBellModalVisible(true)}>
        <Text style={styles.bodyText}>{tempSelectedBell}</Text>
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

export default BellSelection;
