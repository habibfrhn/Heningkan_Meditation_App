// File: ActiveTimerModal.tsx
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

    if (!isPaused && preparationTime > 0) {
      interval = setInterval(() => setPreparationTime((prev) => prev - 1), 1000);
    } else if (!isPaused && preparationTime === 0 && timeLeft > 0) {
      setIsRunning(true);
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft <= 0) {
      onClose();
    }

    return () => clearInterval(interval);
  }, [isPaused, preparationTime, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      playBell('start');
      playAmbiance();

      if (intervals.includes('middle')) {
        setTimeout(() => playBell('middle'), (duration / 2) * 1000);
      }
      if (intervals.includes('end')) {
        setTimeout(() => playBell('end'), duration * 1000);
      }
    }

    return () => {
      stopAmbiance();
    };
  }, [isRunning]);

  const playBell = async (type: string) => {
    try {
      if (bellSound) {
        await bellSound.stopAsync();
        await bellSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing bell sound:', error);
    }
  };

  const playAmbiance = async () => {
    try {
      if (ambianceSound) {
        await ambianceSound.setIsLoopingAsync(true);
        await ambianceSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing ambiance sound:', error);
    }
  };

  const stopAmbiance = async () => {
    try {
      if (ambianceSound) {
        await ambianceSound.stopAsync();
        await ambianceSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error stopping ambiance sound:', error);
    }
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    stopAmbiance();
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Modal animationType="slide" transparent={false} visible>
      <View style={styles.modalContainer}>
        <Text style={styles.timerText}>
          {preparationTime > 0 ? `Starting in ${preparationTime}` : formatTime(timeLeft)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePauseResume} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>{isPaused ? 'Continue' : 'Pause'}</Text>
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
