import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface BellIntervalSelectionProps {
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onIntervalChange: (selectedIntervals: string[]) => void;
}

const intervalOptions = ['Beginning', 'Middle', 'End'];

const BellIntervalSelection: React.FC<BellIntervalSelectionProps> = ({
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onIntervalChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<string[]>([]);

  const toggleSelection = (interval: string) => {
    setTempSelections((prev) =>
      prev.includes(interval)
        ? prev.filter((i) => i !== interval)
        : [...prev, interval]
    );
  };

  const handleSave = () => {
    setSelectedIntervals(tempSelections);
    onIntervalChange(tempSelections);
    setModalVisible(false);
  };

  return (
    <>
      <Modal transparent visible={modalVisible} animationType="slide">
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
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => {
        setTempSelections(selectedIntervals);
        setModalVisible(true);
      }}>
        <Text style={styles.selectionText}>
          {selectedIntervals.length > 0
            ? selectedIntervals.join(', ')
            : 'Select Intervals'}
        </Text>
      </TouchableOpacity>
    </>
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
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectionText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default BellIntervalSelection;
