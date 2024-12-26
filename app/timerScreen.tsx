// File: timerScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Vibration, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import TimerCircle from './timerCircle';
import theme from './theme';
import BellSelection from './bellSelection';
import AmbianceSelection from './ambianceSelection';
import StartTimerButton from './startTimerButton';
import TimerDurationSelection from './timerDurationSelection';
import BellIntervalSelection from './bellIntervalSelection';

const { width } = Dimensions.get('window');
const MODAL_PADDING = 12;
const BOX_MARGIN = 10;
const modalWidth = width * 0.9;
const BOX_SIZE = (modalWidth - (2 * MODAL_PADDING + BOX_MARGIN)) / 2;
const MAX_DURATION = 60;
const VIBRATION_PATTERN = [100, 200, 300];

const TimerScreen: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number>(5); // Initial time in minutes
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedBell, setSelectedBell] = useState<string>('Aura Chime');
  const [bellSound, setBellSound] = useState<any>(require('../assets/audio/bell/bell1.mp3'));
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);
  const [selectedAmbiance, setSelectedAmbiance] = useState<string>('No Sound');
  const [ambianceSound, setAmbianceSound] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && remainingTime !== null && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const nextTime = prevTime !== null ? prevTime - 1 : null;

          if (nextTime !== null) {
            if (
              selectedIntervals.includes('Beginning') &&
              nextTime === selectedTime * 60 - 1
            ) {
              playBellSound();
            }
            if (
              selectedIntervals.includes('Middle') &&
              nextTime === Math.floor((selectedTime * 60) / 2)
            ) {
              playBellSound();
            }
            if (selectedIntervals.includes('End') && nextTime === 0) {
              playBellSound();
            }
          }

          return nextTime;
        });
      }, 1000);
    } else if (isPlaying && remainingTime === 0) {
      stopAndReset();
      Alert.alert('Meditation Completed');
      playBellSound();
      Vibration.vibrate(VIBRATION_PATTERN);
    }

    return () => clearInterval(interval);
  }, [isPlaying, remainingTime]);

  const playBellSound = async () => {
    if (bellSound) {
      try {
        const { sound: finalBell } = await Audio.Sound.createAsync(bellSound);
        await finalBell.playAsync();
        finalBell.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            finalBell.unloadAsync();
          }
        });
      } catch (err) {
        console.error('Error playing bell sound:', err);
      }
    }
  };

  const stopAndReset = async () => {
    setRemainingTime(null);
    setIsPlaying(false);
  };

  const handleBellChange = (selectedBellName: string, selectedBellSound: any) => {
    setSelectedBell(selectedBellName);
    setBellSound(selectedBellSound);
  };

  const handleIntervalChange = (intervals: string[]) => {
    setSelectedIntervals(intervals);
  };

  const handleAmbianceChange = (selectedAmbianceName: string, selectedAmbianceSound: any) => {
    setSelectedAmbiance(selectedAmbianceName);
    setAmbianceSound(selectedAmbianceSound);
  };

  const handleStartStopPress = () => {
    if (isPlaying) {
      stopAndReset();
    } else {
      setRemainingTime(selectedTime * 60);
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerCircleSection}>
        <TimerCircle selectedTime={selectedTime} maxDuration={MAX_DURATION} />
      </View>

      <View style={styles.durationSelectionSection}>
        <TimerDurationSelection
          BOX_SIZE={BOX_SIZE}
          BOX_MARGIN={BOX_MARGIN}
          MODAL_PADDING={MODAL_PADDING}
          modalWidth={modalWidth}
          onDurationChange={(duration) => setSelectedTime(duration)}
        />
      </View>

      <View style={styles.audioSection}>
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Bell Selection</Text>
          <BellSelection
            bellOptions={[
              { name: 'No Sound', sound: null },
              { name: 'Aura Chime', sound: require('../assets/audio/bell/bell1.mp3') },
              { name: 'Zen Whisper', sound: require('../assets/audio/bell/bell2.mp3') },
              { name: 'Celestial Ring', sound: require('../assets/audio/bell/bell3.mp3') },
            ]}
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onBellChange={handleBellChange}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Bell Intervals</Text>
          <BellIntervalSelection
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onIntervalChange={handleIntervalChange}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <AmbianceSelection
            ambianceOptions={[
              { name: 'No Sound', sound: null },
              { name: 'Rain', sound: require('../assets/audio/ambience/rain.mp3') },
              { name: 'Campfire', sound: require('../assets/audio/ambience/campfire.mp3') },
              { name: 'Wind Chimes', sound: require('../assets/audio/ambience/windChimes.mp3') },
            ]}
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onAmbianceChange={handleAmbianceChange}
          />
        </View>
      </View>
      <View style={styles.buttonSection}>
        <StartTimerButton
          isPlaying={isPlaying}
          onPress={handleStartStopPress}
          selectedDuration={selectedTime * 60}
          selectedBellSound={bellSound}
          selectedAmbianceSound={ambianceSound}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  timerCircleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  durationSelectionSection: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  audioSection: {
    flex: 2,
    borderTopWidth: 1,
    borderColor: theme.COLORS.black,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: theme.COLORS.black,
    width: '100%',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 25,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TimerScreen;
