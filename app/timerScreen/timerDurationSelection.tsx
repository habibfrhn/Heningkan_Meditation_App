import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import { COLORS } from '../theme';

interface TimerDurationSelectionProps {
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onDurationChange: (selectedDuration: number) => void;
}

const TimerDurationSelection: React.FC<TimerDurationSelectionProps> = ({
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onDurationChange,
}) => {
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const durationOptions = [
    { label: '5 menit', value: 5 },
    { label: '10 menit', value: 10 },
    { label: '15 menit', value: 15 },
    { label: '30 menit', value: 30 },
    { label: '45 menit', value: 45 },
    { label: '60 menit', value: 60 },
  ];

  const saveDurationSelection = () => {
    onDurationChange(selectedDuration);
    setDurationModalVisible(false);
  };

  const handleBoxPress = (value: number) => {
    Vibration.vibrate(50);
    setSelectedDuration(value);
  };

  return (
    <>
      <Modal
        visible={durationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDurationModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDurationModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { width: modalWidth, padding: MODAL_PADDING },
                ]}
              >
                <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                  {durationOptions.map((option) => {
                    const isSelected = option.value === selectedDuration;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.modalOption,
                          { width: BOX_SIZE, height: BOX_SIZE },
                          isSelected && styles.activeModalOption,
                        ]}
                        onPress={() => handleBoxPress(option.value)}
                      >
                        <Text style={styles.modalOptionText}>{option.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[styles.buttonContainer, { marginTop: BOX_MARGIN / 2 }]}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setDurationModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveDurationSelection}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity onPress={() => setDurationModalVisible(true)}>
        <Text style={styles.bodyText}>{selectedDuration} menit</Text>
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
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalOption: {
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeModalOption: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.black,
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
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bodyText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
});

export default TimerDurationSelection;
