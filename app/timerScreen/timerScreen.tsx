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
import { useAudioManager } from '../audioManager';

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

  // The intervals selected by the user. We'll apply special logic if "None" is chosen
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);

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
   * Here is where we implement special logic for 'None':
   * If the user includes "None" in their selection, we can ignore all other intervals.
   * (Feel free to customize this logic however you need.)
   */
  const handleIntervalChange = (intervals: string[]) => {
    if (intervals.includes('None')) {
      // If "None" is selected, we disregard any others
      setSelectedIntervals(['None']);
    } else {
      setSelectedIntervals(intervals);
    }
  };

  return (
    <View style={styles.container}>
      {/* Timer Circle */}
      <View style={styles.timerCircleSection}>
        <TimerCircle selectedTime={selectedTime} maxDuration={60} />
      </View>

      <View style={styles.audioContainer}>
        <Text style={styles.sectionTitle}>Durasi timer</Text>
        <TimerDurationSelection
          BOX_SIZE={BOX_SIZE}
          BOX_MARGIN={BOX_MARGIN}
          MODAL_PADDING={MODAL_PADDING}
          modalWidth={modalWidth}
          onDurationChange={(duration) => setSelectedTime(duration)}
        />
      </View>

      {/* Audio Selections */}
      <View style={styles.audioSection}>
        {/* Bell Selection */}
        <View style={styles.audioContainer}>
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

        {/* Bell Intervals (with special logic in handleIntervalChange) */}
        <View style={styles.audioContainer}>
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

        {/* Ambient Sound */}
        <View style={styles.audioContainer}>
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

      {/* Start/Stop Button */}
      <View style={styles.buttonSection}>
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
  },
  durationSelectionSection: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  audioSection: {
    flex: 2,
    borderTopWidth: 1,
    borderColor: theme.COLORS.black,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 25,
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
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
