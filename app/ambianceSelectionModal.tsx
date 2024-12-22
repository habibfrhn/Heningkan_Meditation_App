import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import theme from './theme';

/* ----------------------------------- TYPES ----------------------------------- */
interface AmbianceOption {
  name: string;
  sound: any;
}

interface AmbianceSelectionModalProps {
  visible: boolean;
  // We pass in our own close function from TimerScreen
  onCloseModal: () => void;

  ambianceOptions: AmbianceOption[];
  tempSelectedAmbiance: string;
  onAmbianceSelect: (option: AmbianceOption) => void;
  onSave: () => void;

  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
}

const AmbianceSelectionModal: React.FC<AmbianceSelectionModalProps> = ({
  visible,
  onCloseModal,
  ambianceOptions,
  tempSelectedAmbiance,
  onAmbianceSelect,
  onSave,
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      // For hardware back button on Android
      onRequestClose={onCloseModal}
    >
      {/* Close modal if user taps outside overlay */}
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { padding: MODAL_PADDING, width: '90%' }]}>
              {/* 2×2 Grid of ambiance options */}
              <View style={[styles.modalGrid, { marginBottom: BOX_MARGIN }]}>
                {/* First row */}
                <View style={[styles.modalRow, { marginBottom: BOX_MARGIN }]}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedAmbiance === ambianceOptions[0].name && styles.activeModalOption,
                    ]}
                    onPress={() => onAmbianceSelect(ambianceOptions[0])}
                  >
                    <Text style={styles.modalOptionText}>{ambianceOptions[0].name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedAmbiance === ambianceOptions[1].name && styles.activeModalOption,
                    ]}
                    onPress={() => onAmbianceSelect(ambianceOptions[1])}
                  >
                    <Text style={styles.modalOptionText}>{ambianceOptions[1].name}</Text>
                  </TouchableOpacity>
                </View>

                {/* Second row */}
                <View style={[styles.modalRow, { marginBottom: BOX_MARGIN }]}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedAmbiance === ambianceOptions[2].name && styles.activeModalOption,
                    ]}
                    onPress={() => onAmbianceSelect(ambianceOptions[2])}
                  >
                    <Text style={styles.modalOptionText}>{ambianceOptions[2].name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      { width: BOX_SIZE, height: BOX_SIZE },
                      tempSelectedAmbiance === ambianceOptions[3].name && styles.activeModalOption,
                    ]}
                    onPress={() => onAmbianceSelect(ambianceOptions[3])}
                  >
                    <Text style={styles.modalOptionText}>{ambianceOptions[3].name}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  // Parent is responsible for stopping preview, then calling onSave
                  onSave();
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
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
  saveButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: theme.COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: theme.COLORS.white,
  },
});

export default AmbianceSelectionModal;
