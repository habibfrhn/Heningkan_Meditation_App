// activeTimerModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bellsPlayed, setBellsPlayed] = useState({
    awal: false,
    tengah: false,
    akhir: false,
  });

  // Refs to track interval timers
  const intervalRefs = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused && preparationTime > 0) {
      interval = setInterval(() => setPreparationTime((prev) => prev - 1), 1000);
    } else if (!isPaused && preparationTime === 0 && timeLeft > 0) {
      setIsRunning(true);
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft <= 0) {
      handleSessionEnd();
    }

    return () => clearInterval(interval);
  }, [isPaused, preparationTime, timeLeft]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      initializeIntervals();
      playAmbiance();
    } else {
      pauseAmbiance();
    }

    return () => clearAllIntervals();
  }, [isRunning, isPaused]);

  const initializeIntervals = () => {
    clearAllIntervals();

    if (!intervals.includes('None')) {
      if (intervals.includes('Awal') && !bellsPlayed.awal) {
        playBell('Awal');
        setBellsPlayed((prev) => ({ ...prev, awal: true }));
      }
      if (intervals.includes('Tengah') && !bellsPlayed.tengah) {
        const tengahTimeout = setTimeout(() => {
          playBell('Tengah');
          setBellsPlayed((prev) => ({ ...prev, tengah: true }));
        }, (duration / 2) * 1000);
        intervalRefs.current.add(tengahTimeout);
      }
      if (intervals.includes('Akhir') && !bellsPlayed.akhir) {
        const akhirTimeout = setTimeout(() => {
          playBell('Akhir');
          setBellsPlayed((prev) => ({ ...prev, akhir: true }));
        }, duration * 1000);
        intervalRefs.current.add(akhirTimeout);
      }
    }
  };

  const clearAllIntervals = () => {
    intervalRefs.current.forEach(clearTimeout);
    intervalRefs.current.clear();
  };

  const playBell = async (type: string) => {
    try {
      if (bellSound) {
        await bellSound.playAsync();
      }
    } catch (error) {
      console.error(`Error playing bell (${type}):`, error);
    }
  };

  const playAmbiance = async () => {
    try {
      if (ambianceSound) {
        const status = await ambianceSound.getStatusAsync();

        if (status.isLoaded && !status.isPlaying) {
          await ambianceSound.setIsLoopingAsync(true);
          await ambianceSound.playAsync();
        }
      }
    } catch (error) {
      console.error('Error playing ambiance sound:', error);
    }
  };

  const pauseAmbiance = async () => {
    try {
      if (ambianceSound) {
        await ambianceSound.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing ambiance sound:', error);
    }
  };

  const resetAudio = async () => {
    try {
      if (bellSound) {
        await bellSound.stopAsync();
        await bellSound.setPositionAsync(0);
      }
      if (ambianceSound) {
        await ambianceSound.stopAsync();
        await ambianceSound.setPositionAsync(0);
      }
    } catch (error) {
      console.error('Error resetting audio:', error);
    }
  };

  const resetModal = async () => {
    await resetAudio();
    clearAllIntervals();
    setTimeLeft(duration);
    setPreparationTime(5);
    setIsPaused(false);
    setIsRunning(false);
    setBellsPlayed({
      awal: false,
      tengah: false,
      akhir: false,
    });
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    setIsPaused(true);
    setShowConfirmation(true);
  };

  const handleConfirmStop = async (confirm: boolean) => {
    setShowConfirmation(false);
    if (confirm) {
      await resetSession();
    } else {
      setIsPaused(false);
    }
  };

  const handleSessionEnd = async () => {
    await resetSession();
  };

  const resetSession = async () => {
    await resetAudio();
    pauseAmbiance();
    onClose();
    await resetModal();
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
          {preparationTime > 0
            ? `Starting in ${preparationTime}`
            : formatTime(timeLeft)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePauseResume} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>
              {isPaused ? 'Play' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStop} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showConfirmation && (
        <Modal animationType="fade" transparent visible>
          <TouchableWithoutFeedback onPress={() => handleConfirmStop(false)}>
            <View style={styles.overlay}>
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>
                  Apakah anda yakin ingin membatalkan sesi meditasi?
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.confirmButton]}
                    onPress={() => handleConfirmStop(true)}
                  >
                    <Text style={styles.controlButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.confirmButton]}
                    onPress={() => handleConfirmStop(false)}
                  >
                    <Text style={styles.controlButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: theme.COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    marginHorizontal: 10,
  },
});

export default ActiveTimerModal;
