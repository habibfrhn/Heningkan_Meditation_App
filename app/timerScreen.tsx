import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Vibration,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { Audio } from 'expo-av';
import Svg, { Circle, G } from 'react-native-svg';
import theme from './theme';

// Modals
import BellSelectionModal from './bellSelectionModal';
import AmbianceSelectionModal from './ambianceSelectionModal';

// Layout constants
const { width } = Dimensions.get('window');
const MODAL_PADDING = 12;  // Internal padding for the modal
const BOX_MARGIN = 10;     // Margin between boxes and rows
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

// Helper function to convert degrees to radians
const degToRad = (deg: number): number => (deg * Math.PI) / 180;

// Helper function to calculate angle from x,y coordinates
const calculateAngle = (x: number, y: number, centerX: number, centerY: number): number => {
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  return angle;
};

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
  // Default to "No Sound" (change if you want a different default)
  const [tempSelectedAmbiance, setTempSelectedAmbiance] = useState<string>('No Sound'); 
  const [selectedAmbiance, setSelectedAmbiance] = useState<string>('No Sound');
  const [ambianceSound, setAmbianceSound] = useState<any>(null);
  const [ambiancePreviewSound, setAmbiancePreviewSound] = useState<Audio.Sound | null>(null);

  // Animations
  const animatedValue = useRef(new Animated.Value(selectedTime)).current;

  // Circular Slider Constants
  const CIRCLE_SIZE = 220;
  const STROKE_WIDTH = 10;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CENTER = CIRCLE_SIZE / 2;
  const circumference = 2 * Math.PI * RADIUS;

  const [angle, setAngle] = useState<number>((selectedTime / MAX_DURATION) * 360);

  const pan = useRef({ x: 0, y: 0 }).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        handleGesture(evt.nativeEvent);
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        handleGesture(evt.nativeEvent);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

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

  // Update angle when selectedTime changes
  useEffect(() => {
    const newAngle = (selectedTime / MAX_DURATION) * 360;
    Animated.timing(animatedValue, {
      toValue: newAngle,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setAngle(newAngle);
  }, [selectedTime]);

  useEffect(() => {
    if (remainingTime === 0 && isPlaying) {
      stopAndReset();
      Alert.alert('Meditation Completed');
      playBellSound();
      Vibration.vibrate(VIBRATION_PATTERN);
    }
  }, [remainingTime]);

  /* -------------------- Timer / Bell Logic -------------------- */
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
    // Stop any existing preview for bells
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

        // Stop after 10 seconds
        setTimeout(async () => {
          if (newPreviewSound) {
            await newPreviewSound.stopAsync();
            await newPreviewSound.unloadAsync();
            setPreviewSound(null);
          }
        }, 10000);

        // If it finishes sooner
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

  const stopAndReset = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    if (ambianceSound) {
      ambianceSound.unloadAsync();
      setAmbianceSound(null);
    }
    setRemainingTime(null);
    setIsPlaying(false);
  };

  // Update the selected time in minutes based on angle
  const handleGesture = (nativeEvent: any) => {
    const { locationX, locationY } = nativeEvent;
    const calculatedAngle = calculateAngle(locationX, locationY, CENTER, CENTER);
    const newTime = Math.min(Math.max(Math.round((calculatedAngle / 360) * MAX_DURATION), 1), MAX_DURATION);
    setSelectedTime(newTime);
  };

  /* -------------------- Bell Modal Logic -------------------- */
  const handleBellSelection = (option: { name: string; sound: any }) => {
    setTempSelectedBell(option.name);
    if (option.sound) {
      playPreviewSound(option.sound);
    } else if (previewSound) {
      previewSound.stopAsync();
    }
  };

  const saveBellSelection = async () => {
    // Stop any bell preview before closing
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

  // Closes the bell modal (tap outside or hardware back)
  // Also stop/unload any playing preview
  const handleCloseBellModal = async () => {
    setBellModalVisible(false);
    if (previewSound) {
      await previewSound.stopAsync();
      await previewSound.unloadAsync();
      setPreviewSound(null);
    }
  };

  /* -------------------- Ambiance Modal Logic -------------------- */
  const playAmbiancePreviewSound = async (soundAsset: any) => {
    // Stop any existing ambiance preview
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

        // Stop after 10 seconds
        setTimeout(async () => {
          if (newPreview) {
            await newPreview.stopAsync();
            await newPreview.unloadAsync();
            setAmbiancePreviewSound(null);
          }
        }, 10000);

        // If finishes sooner
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
    // Stop any ambiance preview before closing
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

  // Closes the ambiance modal (tap outside or hardware back)
  // Also stop/unload any playing preview
  const handleCloseAmbianceModal = async () => {
    setAmbianceModalVisible(false);
    if (ambiancePreviewSound) {
      await ambiancePreviewSound.stopAsync();
      await ambiancePreviewSound.unloadAsync();
      setAmbiancePreviewSound(null);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <View style={styles.container}>
      {/* Timer Circle Section */}
      <View style={styles.timerCircleSection}>
        <View style={styles.timerCircle}>
          {/* Circular Slider */}
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
              {/* Background Circle */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke={theme.COLORS.background}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              {/* Progress Circle */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke={theme.COLORS.primary}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${(angle / 360) * circumference} ${circumference}`}
                strokeLinecap="round"
                fill="none"
              />
              {/* Draggable Handle */}
              <Circle
                cx={CENTER + RADIUS * Math.cos(degToRad(angle))}
                cy={CENTER + RADIUS * Math.sin(degToRad(angle))}
                r={12}
                fill={theme.COLORS.primary}
              />
            </G>
            {/* Invisible Circle for Touch Handling */}
            <G {...panResponder.panHandlers}>
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS + STROKE_WIDTH}
                stroke="transparent"
                fill="transparent"
              />
            </G>
          </Svg>

          {/* Inner Circle */}
          <View style={styles.innerCircle}>
            <Text style={styles.timerTextSmall}>Your timer is set to</Text>
            <Text style={styles.timerTextLarge}>{selectedTime} min</Text>
          </View>
        </View>
      </View>

      {/* Quick Duration Buttons */}
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

      {/* Audio Section (Bell + Ambient Sound) */}
      <View style={styles.audioSection}>
        {/* Bell Selection */}
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Bell Selection</Text>
          <TouchableOpacity onPress={() => setBellModalVisible(true)}>
            <Text style={styles.bodyText}>{selectedBell}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* Ambiance Selection */}
        <View style={styles.audioContainer}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity onPress={() => setAmbianceModalVisible(true)}>
            <Text style={styles.bodyText}>{selectedAmbiance}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </View>

      {/* Bell Selection Modal */}
      <BellSelectionModal
        visible={bellModalVisible}
        // Our custom close function
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

      {/* Ambiance Selection Modal */}
      <AmbianceSelectionModal
        visible={ambianceModalVisible}
        // Our custom close function
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

      {/* Start/Stop Timer Button */}
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

/* ----------------------------------- STYLES ----------------------------------- */
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
  timerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
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
