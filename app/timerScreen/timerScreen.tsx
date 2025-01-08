// app/timerScreen/timerScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import theme from '../theme';

// Adjust path to your audioManager
import { useAudioManager } from './audioManagerTimer';

import TimerCircle from './timerCircle';
import TimerDurationSelection from './timerDurationSelection';
import BellSelection from './bellSelection';
import BellIntervalSelection from './bellIntervalSelection';
import AmbianceSelection from './ambianceSelection';
import ActiveTimerModal from './activeTimerModal';

const { width } = Dimensions.get('window');
const MODAL_PADDING = 12;
const BOX_MARGIN = 10;
const modalWidth = width * 0.9;
const BOX_SIZE = (modalWidth - (2 * MODAL_PADDING + BOX_MARGIN)) / 2;

const TimerScreen: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number>(5);
  const [selectedBell, setSelectedBell] = useState<string>('Aura Chime');
  const [selectedAmbiance, setSelectedAmbiance] = useState<string>('No Sound');

  // Intervals selected by the user
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>(['Awal']);

  // Show/hide the active meditation modal
  const [showActiveModal, setShowActiveModal] = useState(false);

  // Grab the preloaded Audio.Sound objects
  const { preloadedBells, preloadedAmbiance } = useAudioManager();

  // Merged StartTimerButton (local)
  type StartTimerButtonProps = {
    isPlaying: boolean;
    onPress: () => void;
    selectedDuration: number;
  };

  const StartTimerButton: React.FC<StartTimerButtonProps> = ({
    isPlaying,
    onPress,
    selectedDuration,
  }) => {
    return (
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: theme.COLORS.primary }]}
        onPress={onPress}
      >
        <Text style={styles.startButtonText}>
          {isPlaying ? 'Stop' : 'Mulai timer'}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleStartStopPress = () => {
    setShowActiveModal((prev) => !prev);
  };

  /**
   * Special logic for 'None' in the bell intervals
   */
  const handleIntervalChange = (intervals: string[]) => {
    if (intervals.includes('None')) {
      setSelectedIntervals(['None']);
    } else {
      setSelectedIntervals(intervals);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1) FIRST CONTAINER — Timer Circle */}
      <View style={styles.firstContainer}>
        <TimerCircle selectedTime={selectedTime} maxDuration={60} />
      </View>

      {/* 2) SECOND CONTAINER — Timer & Audio Selections */}
      <View style={styles.secondContainer}>
        {/* Durasi Timer */}
        <View style={styles.audioBlock}>
          <Text style={styles.sectionTitle}>Durasi timer</Text>
          <TimerDurationSelection
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onDurationChange={(duration) => setSelectedTime(duration)}
          />
        </View>
        <View style={styles.divider} />

        {/* Pilihan Bel */}
        <View style={styles.audioBlock}>
          <Text style={styles.sectionTitle}>Pilihan bel</Text>
          <BellSelection
            bellOptions={[
              { name: 'No Sound' },
              { name: 'Aura Chime' },
              { name: 'Zen Whisper' },
              { name: 'Celestial Ring' },
            ]}
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onBellChange={(bellName: string) => setSelectedBell(bellName)}
          />
        </View>
        <View style={styles.divider} />

        {/* Interval Bel */}
        <View style={styles.audioBlock}>
          <Text style={styles.sectionTitle}>Interval bel</Text>
          <BellIntervalSelection
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onIntervalChange={handleIntervalChange}
          />
        </View>
        <View style={styles.divider} />

        {/* Suara Ambient */}
        <View style={styles.audioBlock}>
          <Text style={styles.sectionTitle}>Suara ambient</Text>
          <AmbianceSelection
            ambianceOptions={[
              { name: 'No Sound' },
              { name: 'Rain' },
              { name: 'Campfire' },
              { name: 'Wind Chimes' },
            ]}
            BOX_SIZE={BOX_SIZE}
            BOX_MARGIN={BOX_MARGIN}
            MODAL_PADDING={MODAL_PADDING}
            modalWidth={modalWidth}
            onAmbianceChange={(ambName: string) => setSelectedAmbiance(ambName)}
          />
        </View>
      </View>

      {/* 3) THIRD CONTAINER — Mulai Timer Button */}
      <View style={styles.thirdContainer}>
        <StartTimerButton
          isPlaying={showActiveModal}
          onPress={handleStartStopPress}
          selectedDuration={selectedTime * 60}
        />
      </View>

      {/* Active Meditation Modal */}
      {showActiveModal && (
        <ActiveTimerModal
          duration={selectedTime * 60}
          bellSound={preloadedBells[selectedBell] || null}
          ambianceSound={preloadedAmbiance[selectedAmbiance] || null}
          intervals={selectedIntervals}
          onClose={() => setShowActiveModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  /** Outer container that holds everything */
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    paddingHorizontal: 25,
    // This helps give top/bottom spacing. Adjust to taste.
    paddingTop: 65,
    paddingBottom: 45,
    // Distribute the three containers with equal spacing.
    justifyContent: 'space-between',
  },
  /** 1) Timer Circle container */
  firstContainer: {
    alignItems: 'center',
    // If you want a bigger area for the circle, give this a flex or custom height.
  },
  /** 2) Timer & Audio selection container */
  secondContainer: {
    // We'll just let content define its size, with equal top/bottom margin.
    marginVertical: 10,
  },
  /** 3) Start Timer Button container */
  thirdContainer: {
    alignItems: 'center',
  },
  /** Subsection for each audio-related part (Durasi timer, Pilihan bel, etc.) */
  audioBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: theme.COLORS.black,
    width: '100%',
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TimerScreen;
