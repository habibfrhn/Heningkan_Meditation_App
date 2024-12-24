import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';

// Import the new TimerCircle component
import TimerCircle from './timerCircle';

// Import SVG and theme
import theme from './theme';

// Modals
import BellSelectionModal from './bellSelectionModal';
import AmbianceSelectionModal from './ambianceSelectionModal';

// Layout constants
const { width } = Dimensions.get('window');
const MODAL_PADDING = 12; // Internal padding for the modal
const BOX_MARGIN = 10; // Margin between boxes and rows
const modalWidth = width * 0.9;

/*
  BOX_SIZE formula (shared by both modals):
  - The modal is `modalWidth` wide.
  - There's left + right padding on the modal: (2 * MODAL_PADDING).
  - There's 1 horizontal gap between two boxes: BOX_MARGIN.
  => Subtract those from the total width before dividing by 2.
*/
const BOX_SIZE = (modalWidth - (2 * MODAL_PADDING + BOX_MARGIN)) / 2;

// Timer/vibration constants
const MAX_DURATION = 60;
const SECTIONS = [10, 20, 30, 40];
const VIBRATION_PATTERN = [100, 200, 300];

const TimerScreen: React.FC = () => {
  // Timer state
  const [selectedTime, setSelectedTime] = useState<number>(20);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // BELL states
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);
  const [bellModalVisible, setBellModalVisible] = useState<boolean>(false);
  const [tempSelectedBell, setTempSelectedBell] = useState<string>('Aura Chime');
  const [selectedBell, setSelectedBell] = useState<string>('Aura Chime');
  const [bellSound, setBellSound] = useState<any>(null);

  // AMBIANCE states
  const [ambianceModalVisible, setAmbianceModalVisible] = useState<boolean>(false);
  const [tempSelectedAmbiance, setTempSelectedAmbiance] = useState<string>('No Sound');
  const [selectedAmbiance, setSelectedAmbiance] = useState<string>('No Sound');
  const [ambianceSound, setAmbianceSound] = useState<any>(null);
  const [ambiancePreviewSound, setAmbiancePreviewSound] =
    useState<Audio.Sound | null>(null);

  // Bell and Ambiance options
  const bellOptions = [
    { name: 'No Sound', sound: null },
    { name: 'Aura Chime', sound: require('../assets/audio/bell/bell1.mp3') },
    { name: 'Zen Whisper', sound: require('../assets/audio/bell/bell2.mp3') },
    { name: 'Celestial Ring', sound: require('../assets/audio/bell/bell3.mp3') },
  ];

  const ambianceOptions = [
    { name: 'No Sound', sound: null },
    { name: 'Rain', sound: require('../assets/audio/ambience/rain.mp3') },
    { name: 'Campfire', sound: require('../assets/audio/ambience/campfire.mp3') },
    { name: 'Wind Chimes', sound: require('../assets/audio/ambience/windChimes.mp3') },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && remainingTime !== null && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime !== null ? prevTime - 1 : null));
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
        setSound(finalBell);
        await finalBell.playAsync();
      } catch (err) {
        console.error('Error playing bell sound:', err);
      }
    }
  };

  const playPreviewSound = async (soundAsset: any) => {
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }

    if (soundAsset) {
      try {
        const { sound: newPreviewSound } = await Audio.Sound.createAsync(soundAsset);
        setPreviewSound(newPreviewSound);
        await newPreviewSound.playAsync();

        setTimeout(async () => {
          if (newPreviewSound) {
            await newPreviewSound.stopAsync();
            await newPreviewSound.unloadAsync();
            setPreviewSound(null);
          }
        }, 10000);

        newPreviewSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            newPreviewSound.unloadAsync();
            setPreviewSound(null);
          }
        });
      } catch (err) {
        console.error('Error playing bell preview sound:', err);
      }
    }
  };

  const stopAndReset = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    if (ambianceSound) {
      await ambianceSound.unloadAsync();
      setAmbianceSound(null);
    }
    setRemainingTime(null);
    setIsPlaying(false);
  };

  const handleBellSelection = (option: { name: string; sound: any }) => {
    setTempSelectedBell(option.name);
    if (option.sound) {
      playPreviewSound(option.sound);
    } else if (previewSound) {
      previewSound.stopAsync();
    }
  };

  const saveBellSelection = async () => {
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }

    const chosenOption = bellOptions.find((option) => option.name === tempSelectedBell);
    setSelectedBell(tempSelectedBell);
    setBellSound(chosenOption?.sound || null);
    setBellModalVisible(false);
  };

  const handleCloseBellModal = async () => {
    setBellModalVisible(false);
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }
  };

  const playAmbiancePreviewSound = async (soundAsset: any) => {
    if (ambiancePreviewSound) {
      await ambiancePreviewSound.stopAsync();
      await ambiancePreviewSound.unloadAsync();
      setAmbiancePreviewSound(null);
    }

    if (soundAsset) {
      try {
        const { sound: newPreview } = await Audio.Sound.createAsync(soundAsset);
        setAmbiancePreviewSound(newPreview);
        await newPreview.playAsync();

        setTimeout(async () => {
          if (newPreview) {
            await newPreview.stopAsync();
            await newPreview.unloadAsync();
            setAmbiancePreviewSound(null);
          }
        }, 10000);

        newPreview.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            newPreview.unloadAsync();
            setAmbiancePreviewSound(null);
          }
        });
      } catch (err) {
        console.error('Error playing ambiance preview sound:', err);
      }
    }
  };

  const handleAmbianceSelection = (option: { name: string; sound: any }) => {
    setTempSelectedAmbiance(option.name);
    if (option.sound) {
      playAmbiancePreviewSound(option.sound);
    } else if (ambiancePreviewSound) {
      ambiancePreviewSound.stopAsync();
    }
  };

  const saveAmbianceSelection = async () => {
    if (ambiancePreviewSound) {
      await ambiancePreviewSound.stopAsync();
      await ambiancePreviewSound.unloadAsync();
      setAmbiancePreviewSound(null);
    }

    const chosenOption = ambianceOptions.find(
      (option) => option.name === tempSelectedAmbiance
    );
    setSelectedAmbiance(tempSelectedAmbiance);
    setAmbianceSound(chosenOption?.sound || null);
    setAmbianceModalVisible(false);
  };

  const handleCloseAmbianceModal = async () => {
    setAmbianceModalVisible(false);
    if (ambiancePreviewSound) {
      await ambiancePreviewSound.stopAsync();
      await ambiancePreviewSound.unloadAsync();
      setAmbiancePreviewSound(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerCircleSection}>
        <TimerCircle
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          maxDuration={MAX_DURATION}
        />
      </View>
      <View style={styles.durationsSection}>
        <View style={styles.durationContainer}>
          {SECTIONS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.durationButton,
                selectedTime === time && styles.activeDurationButton,
              ]}
              onPress={() => setSelectedTime(time)}
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
      <View style={styles.audioSection}>
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Bell Selection</Text>
          <TouchableOpacity onPress={() => setBellModalVisible(true)}>
            <Text style={styles.bodyText}>{selectedBell}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity onPress={() => setAmbianceModalVisible(true)}>
            <Text style={styles.bodyText}>{selectedAmbiance}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </View>
      <BellSelectionModal
        visible={bellModalVisible}
        onCloseModal={handleCloseBellModal}
        bellOptions={bellOptions}
        tempSelectedBell={tempSelectedBell}
        onBellSelect={handleBellSelection}
        onSave={saveBellSelection}
        BOX_SIZE={BOX_SIZE}
        BOX_MARGIN={BOX_MARGIN}
        MODAL_PADDING={MODAL_PADDING}
        modalWidth={modalWidth}
      />
      <AmbianceSelectionModal
        visible={ambianceModalVisible}
        onCloseModal={handleCloseAmbianceModal}
        ambianceOptions={ambianceOptions}
        tempSelectedAmbiance={tempSelectedAmbiance}
        onAmbianceSelect={handleAmbianceSelection}
        onSave={saveAmbianceSelection}
        BOX_SIZE={BOX_SIZE}
        BOX_MARGIN={BOX_MARGIN}
        MODAL_PADDING={MODAL_PADDING}
        modalWidth={modalWidth}
      />
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={
            isPlaying
              ? stopAndReset
              : () => {
                  setRemainingTime(selectedTime * 60);
                  setIsPlaying(true);
                }
          }
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
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  timerCircleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationsSection: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20,
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
    fontSize: 16,
    color: theme.COLORS.black,
  },
  activeDurationText: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
    color: theme.COLORS.black,
    textAlign: 'left',
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
