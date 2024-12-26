import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import BellIntervalSelectionModal from './bellIntervalSelectionModal';

interface BellIntervalSelectionProps {
  BOX_SIZE: number;
  BOX_MARGIN: number;
  MODAL_PADDING: number;
  modalWidth: number;
  onIntervalChange: (selectedIntervals: string[]) => void;
}

const BellIntervalSelection: React.FC<BellIntervalSelectionProps> = ({
  BOX_SIZE,
  BOX_MARGIN,
  MODAL_PADDING,
  modalWidth,
  onIntervalChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);

  const handleSave = (intervals: string[]) => {
    setSelectedIntervals(intervals);
    onIntervalChange(intervals);
    setModalVisible(false);
  };

  return (
    <>
      <BellIntervalSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        selectedIntervals={selectedIntervals}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
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
  selectionText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default BellIntervalSelection;
