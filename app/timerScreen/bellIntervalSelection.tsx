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

interface BellIntervalSelectionProps {
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onIntervalChange: (selectedIntervals: string[]) => void;
}

/**
 * We have four options:
 *  - 'None'
 *  - 'Beginning' (default)
 *  - 'Middle'
 *  - 'End'
 */
const intervalOptions = ['None', 'Beginning', 'Middle', 'End'];

const BellIntervalSelection: React.FC<BellIntervalSelectionProps> = ({
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onIntervalChange,
}) => {
  // Default to ["Beginning"]
  const [tempSelections, setTempSelections] = useState<string[]>(['Beginning']);

  // Controls modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * User clicks an option:
   * - If they click 'None', that becomes the *only* selection.
   * - Otherwise, we remove 'None' if it's in the array, and toggle the chosen interval.
   */
  const handleOptionPress = (option: string) => {
    // If user chose "None", then that is the only selection
    if (option === 'None') {
      setTempSelections(['None']);
      return;
    }

    // Otherwise, remove "None" if it was previously selected
    let newSelections = tempSelections.filter((item) => item !== 'None');

    // Toggle the chosen option
    if (newSelections.includes(option)) {
      // Already selected, so unselect it
      newSelections = newSelections.filter((item) => item !== option);
    } else {
      // Not selected yet, so add it
      newSelections.push(option);
    }

    // If user ends up unselecting everything, we allow an empty array
    setTempSelections(newSelections);
  };

  /**
   * Save the selected intervals to the parent
   */
  const saveIntervalSelection = () => {
    onIntervalChange(tempSelections);
    setModalVisible(false);
  };

  /**
   * Cancel and revert any changes
   */
  const cancelSelection = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* MODAL */}
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

                {/* Save/Cancel Buttons */}
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

      {/* Pressing this text opens the modal */}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.bodyText}>
          {/* Display "None" if it's in the selection, otherwise display selected intervals,
              or fallback to "Select Intervals" if empty array. */}
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
  // Similar styles to bellSelection
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
