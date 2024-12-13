import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  peach: '#FFB4A2',
};

const TimerScreen: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scale] = useState(new Animated.Value(1));
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAndReset();
      };
    }, [])
  );

  useEffect(() => {
    if (remainingTime === 0 && isPlaying) {
      stopAndReset();
      Alert.alert('Meditation Completed');
    }
  }, [remainingTime, isPlaying]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/Ocean_Wave_Audio.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
    } catch (error) {
      console.error('Failed to load sound', error);
      Alert.alert('Error', 'Failed to load the audio file.');
    }
  };

  const startTimer = (minutes: number) => {
    setSelectedTime(minutes);
    setRemainingTime(minutes * 60);
    setIsPlaying(true);
    playSound();
    startPulseAnimation();

    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    setTimerInterval(interval);
  };

  const stopAndReset = async () => {
    if (timerInterval) clearInterval(timerInterval);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    setSelectedTime(null);
    setRemainingTime(null);
    setIsPlaying(false);
    setSound(null);
    scale.stopAnimation();
    scale.setValue(1);
  };

  const pauseOrContinue = async () => {
    if (isPlaying) {
      if (timerInterval) clearInterval(timerInterval);
      if (sound) await sound.pauseAsync();
      scale.stopAnimation();
    } else {
      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      setTimerInterval(interval);
      if (sound) await sound.playAsync();
      startPulseAnimation();
    }
    setIsPlaying(!isPlaying);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Durasi Meditasimu</Text>

      <View style={styles.spacerBetweenTitleAndCircle} />

      <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />

      <View style={styles.spacerExtraLarge} />

      <View style={styles.timerButtons}>
        {[
          { time: 5, label: '5 Menit' },
          { time: 15, label: '15 Menit' },
          { time: 30, label: '30 Menit' },
        ].map(({ time, label }) => (
          <TouchableOpacity
            key={time}
            style={styles.timerButton}
            onPress={() => startTimer(time)}
          >
            <Text style={styles.timerText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {remainingTime !== null && (
        <Text style={styles.timerDisplay}>
          Sisa Waktu: {formatTime(remainingTime)}
        </Text>
      )}

      {selectedTime && (
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={pauseOrContinue}
          >
            <Text style={styles.controlText}>
              {isPlaying ? 'Pause' : 'Lanjutkan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={stopAndReset}>
            <Text style={styles.controlText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.footerQuote}>
        "Tenangkan pikiran, damaikan jiwa."
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  spacerBetweenTitleAndCircle: {
    height: 75,
  },
  spacerExtraLarge: {
    height: 60,
  },
  circle: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.peach,
    borderRadius: 75,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 20,
  },
  timerButton: {
    backgroundColor: COLORS.peach,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timerText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerDisplay: {
    color: COLORS.black,
    fontSize: 22,
    marginVertical: 10,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  controlText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerQuote: {
    fontSize: 14,
    color: COLORS.black,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default TimerScreen;
