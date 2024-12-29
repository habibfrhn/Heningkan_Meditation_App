// File: activeTimerModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import theme from '../theme';

interface ActiveTimerModalProps {
  duration: number;
  bellSound: Audio.Sound | null;
  ambianceSound: Audio.Sound | null;
  intervals: string[];
  onClose: () => void;
}

const ActiveTimerModal: React.FC<ActiveTimerModalProps> = ({
  duration,
  bellSound,
  ambianceSound,
  intervals,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [preparationTime, setPreparationTime] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // 1) Count down the 5-second preparation time
    if (!isPaused && preparationTime > 0) {
      interval = setInterval(() => setPreparationTime((prev) => prev - 1), 1000);

    // 2) After prep time, run the main timer
    } else if (!isPaused && preparationTime === 0 && timeLeft > 0) {
      setIsRunning(true);
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    // 3) If time runs out, close the modal
    } else if (timeLeft <= 0) {
      onClose();
    }

    return () => clearInterval(interval);
  }, [isPaused, preparationTime, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      // Play bell at start
      playBell('start');
      // Start ambiance looping
      playAmbiance();

      // If user wants a bell in the middle of the session
      if (intervals.includes('middle')) {
        setTimeout(() => playBell('middle'), (duration / 2) * 1000);
      }
      // If user wants a bell at the end
      if (intervals.includes('end')) {
        setTimeout(() => playBell('end'), duration * 1000);
      }
    }

    // Cleanup on unmount or if the timer is stopped
    return () => {
      stopAmbiance();
    };
  }, [isRunning]);

  // Play the bell sound (start/middle/end)
  const playBell = async (type: string) => {
    try {
      if (bellSound) {
        // Rewind to start
        await bellSound.stopAsync();
        await bellSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing bell sound:', error);
    }
  };

  // Start playing ambiance in a loop
  const playAmbiance = async () => {
    try {
      console.log('Attempting to play ambiance:', ambianceSound);
      if (ambianceSound) {
        console.log('ambianceSound is loaded?');
        await ambianceSound.setIsLoopingAsync(true);
        await ambianceSound.stopAsync();
        await ambianceSound.setPositionAsync(0);
        await ambianceSound.playAsync();
        console.log('Ambiance is now playing');
      }
    } catch (error) {
      console.error('Error playing ambiance sound:', error);
    }
  };
  

  // Stop ambiance but DO NOT unloadAsync, so we can replay without error
  const stopAmbiance = async () => {
    try {
      if (ambianceSound) {
        await ambianceSound.stopAsync();
        // Removed: await ambianceSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error stopping ambiance sound:', error);
    }
  };

  // Pause or resume the entire timer
  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  // Stop everything and close
  const handleStop = () => {
    stopAmbiance();
    onClose();
  };

  // Formatting helper for mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Modal animationType="slide" transparent={false} visible>
      <View style={styles.modalContainer}>
        <Text style={styles.timerText}>
          {preparationTime > 0
            ? `Starting in ${preparationTime}`
            : formatTime(timeLeft)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePauseResume} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>
              {isPaused ? 'Continue' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStop} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.COLORS.white,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 5,
  },
  controlButtonText: {
    color: theme.COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActiveTimerModal;
