// startTimerModal.tsx

import React, { useState, useEffect, useRef } from 'react'; // Added `useRef` import
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';

interface StartTimerModalProps {
  visible: boolean;
  onClose: () => void;
  timerDuration: number; // in seconds
  bellSound: any;
  ambianceSound: any;
}

const StartTimerModal: React.FC<StartTimerModalProps> = ({
  visible,
  onClose,
  timerDuration,
  bellSound,
  ambianceSound,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const ambianceVolume = useRef(new Animated.Value(1)).current; // `useRef` correctly imported

  const playSound = async (sound: any) => {
    if (sound) {
      const { sound: playbackSound } = await Audio.Sound.createAsync(sound);
      await playbackSound.playAsync();
    }
  };

  const loopAmbiance = async (sound: any, duration: number) => {
    const { sound: ambiancePlayback } = await Audio.Sound.createAsync(sound, { isLooping: true });
    await ambiancePlayback.playAsync();

    setTimeout(async () => {
      Animated.timing(ambianceVolume, {
        toValue: 0,
        duration: 5000, // Gradually reduce volume over 5 seconds
        useNativeDriver: true,
      }).start();

      await ambiancePlayback.stopAsync();
      await ambiancePlayback.unloadAsync();
    }, duration - 5000);

    return ambiancePlayback;
  };

  useEffect(() => {
    if (visible && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }

    if (countdown === 0 && !isTimerRunning) {
      setIsTimerRunning(true);

      // Play bell sound at the start of the timer
      playSound(bellSound);

      // Start ambiance audio with looping
      loopAmbiance(ambianceSound, timerDuration * 1000);

      // End timer and close modal
      setTimeout(() => {
        playSound(bellSound); // Play bell sound at the end
        onClose();
      }, timerDuration * 1000);
    }
  }, [countdown, visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.timerText}>{countdown > 0 ? countdown : 'Running Timer'}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartTimerModal;
