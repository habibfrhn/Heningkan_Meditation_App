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
import theme from '../../theme';

interface AmbianceOption {
  name: string;
  sound: any;
}

interface AmbianceSelectionModalProps {
  visible: boolean;
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
  const handleBoxPress = (option: AmbianceOption) => {
    Vibration.vibrate(50);
    onAmbianceSelect(option);
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
                    onPress={() => handleBoxPress(option)}
                  >
                    <Text style={styles.modalOptionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
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
                  onPress={onSave}
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
});

export default AmbianceSelectionModal;
