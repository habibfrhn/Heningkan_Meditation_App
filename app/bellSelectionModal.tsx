import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import theme from './theme';

/* ----------------------------------- TYPES ----------------------------------- */
interface BellOption {
  name: string;
  sound: any;
}

interface BellSelectionModalProps {
  visible: boolean;
  onCloseModal: () => void;
  bellOptions: BellOption[];
  tempSelectedBell: string;
  onBellSelect: (option: BellOption) => void;
  onSave: () => void;
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
}

const BellSelectionModal: React.FC<BellSelectionModalProps> = ({
  visible,
  onCloseModal,
  bellOptions,
  tempSelectedBell,
  onBellSelect,
  onSave,
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
}) => {
  const handleBoxPress = (option: BellOption) => {
    Vibration.vibrate(50); // Vibrate for 50ms on box click
    onBellSelect(option);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onCloseModal}
    >
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { padding: MODAL_PADDING, width: '90%' }]}>
              <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                <View style={[styles.modalRow, { marginBottom: BOX_MARGIN }]}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedBell === bellOptions[0]?.name && styles.activeModalOption,
                    ]}
                    onPress={() => handleBoxPress(bellOptions[0])}
                  >
                    <Text style={styles.modalOptionText}>{bellOptions[0]?.name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedBell === bellOptions[1]?.name && styles.activeModalOption,
                    ]}
                    onPress={() => handleBoxPress(bellOptions[1])}
                  >
                    <Text style={styles.modalOptionText}>{bellOptions[1]?.name}</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.modalRow, { marginBottom: BOX_MARGIN }]}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedBell === bellOptions[2]?.name && styles.activeModalOption,
                    ]}
                    onPress={() => handleBoxPress(bellOptions[2])}
                  >
                    <Text style={styles.modalOptionText}>{bellOptions[2]?.name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedBell === bellOptions[3]?.name && styles.activeModalOption,
                    ]}
                    onPress={() => handleBoxPress(bellOptions[3])}
                  >
                    <Text style={styles.modalOptionText}>{bellOptions[3]?.name}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.buttonContainer, { marginTop: BOX_MARGIN / 2 }]}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCloseModal}
                >
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/* ---------------------- STYLES ---------------------- */
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
  modalGrid: {},
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOption: {
    borderRadius: 10,
    backgroundColor: theme.COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default BellSelectionModal;