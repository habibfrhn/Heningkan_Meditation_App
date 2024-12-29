import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import theme from '../theme'; // Adjust the path based on your project structure

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
      <Modal
        transparent={true}
        visible={ambianceModalVisible}
        animationType="slide"
        onRequestClose={async () => {
          await stopAllAudio();
          setAmbianceModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={async () => {
          await stopAllAudio();
          setAmbianceModalVisible(false);
        }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { padding: MODAL_PADDING, width: modalWidth }]}>
                <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                  {ambianceOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.modalOption,
                        { width: BOX_SIZE, height: BOX_SIZE },
                        tempSelectedAmbiance === option.name && styles.activeModalOption,
                      ]}
                      onPress={() => handleAmbianceSelection(option)}
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
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveAmbianceSelection}
                  >
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
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: theme.COLORS.white, borderRadius: 10 },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  modalOption: { borderRadius: 10, backgroundColor: theme.COLORS.background, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  activeModalOption: { borderWidth: 2, borderColor: theme.COLORS.primary },
  modalOptionText: { fontSize: 16, color: theme.COLORS.black },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: 'transparent', padding: 10, borderRadius: 8, flex: 1, marginRight: 10 },
  cancelButtonText: { color: theme.COLORS.black, textAlign: 'center', fontWeight: 'bold' },
  saveButton: { backgroundColor: theme.COLORS.primary, padding: 10, borderRadius: 8, flex: 1, marginLeft: 10 },
  saveButtonText: { color: theme.COLORS.white, textAlign: 'center', fontWeight: 'bold' },
  bodyText: { fontSize: 14, color: '#000', textAlign: 'left' },
});

export default AmbianceSelection;
