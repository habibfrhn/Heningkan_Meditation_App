// afirmasiHarianModal.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, TEXT_STYLES } from './theme';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

interface AudioItem {
  id: string;
  title: string;
  duration: string;
}

interface AfirmasiHarianModalProps {
  visible: boolean;
  onClose: () => void;
  audio: AudioItem;
}

const AfirmasiHarianModal: React.FC<AfirmasiHarianModalProps> = ({
  visible,
  onClose,
  audio,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(0); // Current playback position
  const [duration, setDuration] = useState<number>(0);       // Total duration in ms

  /**
   * Convert milliseconds -> "MM:SS" (e.g. 01:07, 00:09, 10:15, etc.)
   */
  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const minuteStr = String(minutes).padStart(2, '0'); 
    const secondStr = String(seconds).padStart(2, '0');
    return `${minuteStr}:${secondStr}`;
  };

  /**
   * Load audio when the modal is shown.
   */
  useEffect(() => {
    if (!visible) return;

    const loadAudio = async () => {
      try {
        // Example audio file (replace with your own or from audioManagerAfirmasi)
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/audio/afirmasi/bell1.mp3')
        );
        setSound(newSound);

        // Start playing immediately
        await newSound.playAsync();
        setIsPlaying(true);

        // Subscribe to playback status updates
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setSliderValue(status.positionMillis || 0);

            // If track finishes, reset to start & show Play
            if (status.didJustFinish) {
              setSliderValue(0);
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.error('Error loading afirmasi audio:', error);
      }
    };

    loadAudio();

    // Cleanup when modal closes
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  /**
   * As the user moves the slider, update the displayed position in real time.
   */
  const onValueChange = (value: number) => {
    setSliderValue(value);
  };

  /**
   * When the user finishes sliding, set the audio position.
   */
  const onSlidingComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Cover image (placeholder) */}
        <Image
          source={require('../assets/images/afirmasiHarianBackground.png')}
          style={styles.coverImage}
        />

        {/* Audio title */}
        <Text style={[TEXT_STYLES.sectionTitle, styles.audioTitle]}>
          {audio.title}
        </Text>

        {/* Artist name */}
        <Text style={styles.artistName}>By tenangkan</Text>

        {/* Slider + times */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={sliderValue}
            onValueChange={onValueChange}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor="#999"
            thumbTintColor={COLORS.primary}
          />
          {/* Times aligned under the slider’s ends */}
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              {formatTime(sliderValue)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Text style={styles.playPauseButtonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={{ color: COLORS.white }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AfirmasiHarianModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  coverImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  audioTitle: {
    marginVertical: 8,
    color: COLORS.black,
  },
  artistName: {
    color: COLORS.black,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '80%',
    marginBottom: 30,
  },
  slider: {
    width: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: COLORS.black,
  },
  playPauseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playPauseButtonText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
});
