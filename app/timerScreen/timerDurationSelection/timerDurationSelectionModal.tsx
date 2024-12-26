// timerDurationSelectionModal.tsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Vibration,
} from 'react-native';
import { COLORS } from '../../theme';

interface DurationOption {
  label: string;
  value: number;
}

interface TimerDurationSelectionModalProps {
  visible: boolean;
  onCloseModal: () => void;
  tempSelectedDuration: number;
  onDurationSelect: (option: DurationOption) => void;
  onSave: () => void;
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
}

const TimerDurationSelectionModal: React.FC<TimerDurationSelectionModalProps> = ({
  visible,
  onCloseModal,
  tempSelectedDuration,
  onDurationSelect,
  onSave,
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
}) => {
  const durationOptions: DurationOption[] = [
    { label: '5 menit', value: 5 },
    { label: '10 menit', value: 10 },
    { label: '15 menit', value: 15 },
    { label: '30 menit', value: 30 },
    { label: '45 menit', value: 45 },
    { label: '60 menit', value: 60 },
  ];

  const handleBoxPress = (item: DurationOption) => {
    Vibration.vibrate(50);
    onDurationSelect(item);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
              padding: MODAL_PADDING,
            },
          ]}
        >
          <FlatList
            data={durationOptions}
            keyExtractor={(item) => item.value.toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionBox,
                  {
                    width: BOX_SIZE,
                    height: BOX_SIZE,
                    margin: BOX_MARGIN / 2,
                    backgroundColor:
                      item.value === tempSelectedDuration
                        ? COLORS.primary
                        : COLORS.background,
                  },
                ]}
                onPress={() => handleBoxPress(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        item.value === tempSelectedDuration
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCloseModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                Vibration.vibrate(50); // Add vibration effect
                onSave();
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TimerDurationSelectionModal;
