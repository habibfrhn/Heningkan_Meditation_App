// startTimerButton.tsx

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import StartTimerModal from './startTimerModal'; // Import the modal component
import theme from './theme';

interface StartTimerButtonProps {
  isPlaying: boolean;
  selectedDuration: number; // Timer duration in seconds
  selectedBellSound: any; // Bell sound asset
  selectedAmbianceSound: any; // Ambiance sound asset
  onPress: () => void; // Define the onPress property
}

const StartTimerButton: React.FC<StartTimerButtonProps> = ({
  isPlaying,
  selectedDuration,
  selectedBellSound,
  selectedAmbianceSound,
  onPress, // Add onPress here
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleStart = () => {
    setModalVisible(true); // Open the modal
    onPress(); // Call the onPress function if needed
  };

  return (
    <>
      {/* Start/Stop Timer Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStart}
        activeOpacity={0.7}
      >
        <Text style={styles.startButtonText}>
          {isPlaying ? 'Stop Timer' : 'Start Timer'}
        </Text>
      </TouchableOpacity>

      {/* Start Timer Modal */}
      <StartTimerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Close the modal
        timerDuration={selectedDuration}
        bellSound={selectedBellSound}
        ambianceSound={selectedAmbianceSound}
      />
    </>
  );
};

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    color: theme.COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StartTimerButton;
