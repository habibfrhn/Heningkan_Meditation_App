import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';

interface BellIntervalSelectionProps {
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onIntervalChange: (selectedIntervals: string[]) => void;
}

const intervalOptions = ['None', 'Awal', 'Tengah', 'Akhir'];

const BellIntervalSelection: React.FC<BellIntervalSelectionProps> = ({
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onIntervalChange,
}) => {
  const [tempSelections, setTempSelections] = useState<string[]>(['Awal']);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Notify parent of default selection on mount
    onIntervalChange(['Awal']);
  }, []);

  const handleOptionPress = (option: string) => {
    if (option === 'None') {
      setTempSelections(['None']);
      return;
    }

    let newSelections = tempSelections.filter((item) => item !== 'None');

    if (newSelections.includes(option)) {
      newSelections = newSelections.filter((item) => item !== option);
    } else {
      newSelections.push(option);
    }

    setTempSelections(newSelections);
  };

  const saveIntervalSelection = () => {
    onIntervalChange(tempSelections);
    setModalVisible(false);
  };

  const cancelSelection = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={cancelSelection}
      >
        <TouchableWithoutFeedback onPress={cancelSelection}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { padding: MODAL_PADDING, width: modalWidth },
                ]}
              >
                <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                  {intervalOptions.map((option) => {
                    const isSelected = tempSelections.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalOption,
                          { width: BOX_SIZE, height: BOX_SIZE },
                          isSelected && styles.activeModalOption,
                        ]}
                        onPress={() => handleOptionPress(option)}
                      >
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[styles.buttonContainer, { marginTop: BOX_MARGIN / 2 }]}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={cancelSelection}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveIntervalSelection}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.bodyText}>
          {tempSelections.includes('None')
            ? 'None'
            : tempSelections.length > 0
            ? tempSelections.join(', ')
            : 'Select Intervals'}
        </Text>
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
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  bodyText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
});

export default BellIntervalSelection;
