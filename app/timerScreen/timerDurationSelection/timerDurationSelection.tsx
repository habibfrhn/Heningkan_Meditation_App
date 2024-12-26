import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import TimerDurationSelectionModal from './timerDurationSelectionModal';

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

  const saveDurationSelection = () => {
    onDurationChange(selectedDuration);
    setDurationModalVisible(false);
  };

  return (
    <>
      <TimerDurationSelectionModal
        visible={durationModalVisible}
        onCloseModal={() => setDurationModalVisible(false)}
        tempSelectedDuration={selectedDuration}
        onDurationSelect={(option) => setSelectedDuration(option.value)}
        onSave={saveDurationSelection}
        BOX_SIZE={BOX_SIZE}
        BOX_MARGIN={BOX_MARGIN}
        MODAL_PADDING={MODAL_PADDING}
        modalWidth={modalWidth}
      />
      <TouchableOpacity onPress={() => setDurationModalVisible(true)}>
        <View style={styles.rowContainer}>
          <Text style={styles.labelText}>Timer Duration</Text>
          <Text style={styles.bodyText}>{selectedDuration} menit</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 10 },
  labelText: { fontSize: 16, fontWeight: 'bold', color: '#000', flex: 1 },
  bodyText: { fontSize: 14, color: '#000', textAlign: 'right', flex: 1 },
});

export default TimerDurationSelection;
