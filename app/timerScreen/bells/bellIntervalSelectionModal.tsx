import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface BellIntervalSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (intervals: string[]) => void;
  selectedIntervals: string[];
}

const intervalOptions = ['Beginning', 'Middle', 'End'];

const BellIntervalSelectionModal: React.FC<BellIntervalSelectionModalProps> = ({
  visible,
  onClose,
  onSave,
  selectedIntervals,
}) => {
  const [tempSelections, setTempSelections] = useState<string[]>(selectedIntervals);

  const toggleSelection = (interval: string) => {
    setTempSelections((prev) =>
      prev.includes(interval) ? prev.filter((i) => i !== interval) : [...prev, interval]
    );
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Intervals</Text>
          {intervalOptions.map((interval) => (
            <TouchableOpacity
              key={interval}
              style={[
                styles.option,
                tempSelections.includes(interval) && styles.selectedOption,
              ]}
              onPress={() => toggleSelection(interval)}
            >
              <Text>{interval}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => onSave(tempSelections)}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#d3d3d3',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
});

export default BellIntervalSelectionModal;
