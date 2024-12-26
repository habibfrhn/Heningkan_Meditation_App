// File: StartTimerButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from './theme';

interface StartTimerButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  selectedDuration: number;
  selectedBellSound: any;
  selectedAmbianceSound: any;
}

const StartTimerButton: React.FC<StartTimerButtonProps> = ({
  isPlaying,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.startButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.startButtonText}>
        {isPlaying ? 'Stop Timer' : 'Start Timer'}
      </Text>
    </TouchableOpacity>
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
