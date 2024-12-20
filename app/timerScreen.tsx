import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import theme from './theme';

const MAX_DURATION = 60;
const SECTIONS = [10, 20, 30, 40];
const VIBRATION_PATTERN = [100, 200, 300];

const TimerScreen: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number>(20);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const animatedValue = useRef(new Animated.Value(selectedTime)).current;
  const circleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selectedTime,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [selectedTime]);

  useEffect(() => {
    if (remainingTime === 0 && isPlaying) {
      stopAndReset();
      Alert.alert('Meditation Completed');
      playBellSound();
      Vibration.vibrate(VIBRATION_PATTERN);
    }
  }, [remainingTime]);

  const playBellSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/MeditationEnding.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error('Error loading bell sound:', err);
    }
  };

  const stopAndReset = () => {
    if (sound) sound.unloadAsync();
    setRemainingTime(null);
    setIsPlaying(false);
    Animated.spring(circleScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const updateTime = (newMinutes: number) => {
    if (newMinutes >= 0 && newMinutes <= MAX_DURATION) {
      setSelectedTime(newMinutes);
      Vibration.vibrate(50);
    }
  };

  return (
    <View style={styles.container}>
      {/* Timer Circle Section */}
      <View style={styles.timerCircleSection}>
        <View style={styles.timerCircle}>
          <Animated.View
            style={[
              styles.outerCircle,
              { transform: [{ scale: circleScale }] },
            ]}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.timerTextSmall}>Your timer is set to</Text>
            <Text style={styles.timerTextLarge}>{selectedTime} min</Text>
          </View>
        </View>
      </View>

      {/* Predefined Durations Section */}
      <View style={styles.durationsSection}>
        <View style={styles.durationContainer}>
          {SECTIONS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.durationButton,
                selectedTime === time && styles.activeDurationButton,
              ]}
              onPress={() => updateTime(time)}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  selectedTime === time && styles.activeDurationText,
                ]}
              >
                {time}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bell and Ambient Sound Section */}
      <View style={styles.audioSection}>
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Bell Selection</Text>
          <Text style={styles.bodyText}>Nano Bell</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <Text style={styles.bodyText}>Theta Waves</Text>
        </View>
      </View>

      {/* Start Timer Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={isPlaying ? stopAndReset : () => setRemainingTime(selectedTime * 60)}
        >
          <Text style={styles.startButtonText}>
            {isPlaying ? 'Stop Timer' : 'Start Timer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  timerCircleSection: {
    flex: 2, // Keep the circle section at the top
    justifyContent: 'flex-end', // Align the circle to the bottom of the section
    alignItems: 'center',
    paddingTop: 40, // Increased padding to create more space from the top of the screen
    paddingBottom: 30, // Maintain spacing between the circle and the minutes selection
  },
  durationsSection: {
    flex: 1,
    justifyContent: 'flex-start', // Align the durations closer to the top
    alignItems: 'center',
    paddingTop: 10, // Small padding to control spacing
  },
  timerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 10,
    borderColor: theme.COLORS.primary,
    position: 'absolute',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  timerTextSmall: {
    fontSize: 14,
    color: theme.COLORS.black,
    textAlign: 'center',
  },
  timerTextLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  durationButton: {
    backgroundColor: theme.COLORS.background,
    padding: 15,
    borderRadius: 10,
  },
  activeDurationButton: {
    backgroundColor: theme.COLORS.primary,
  },
  durationButtonText: {
    textAlign: 'center',
  },
  activeDurationText: {
    color: theme.COLORS.white,
  },
  audioSection: {
    flex: 2,
    borderTopWidth: 1,
    borderColor: theme.COLORS.black,
    paddingTop: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: theme.COLORS.black,
    marginVertical: 10,
    width: '100%',
  },
  audioContainer: {
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    color: theme.COLORS.white,
    fontSize: 18,
  },
});

export default TimerScreen;
