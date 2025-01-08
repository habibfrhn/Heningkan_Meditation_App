import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, TEXT_STYLES } from '../theme';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

interface AudioItem {
  id: string;
  title: string;
  duration: string;
  filePath: any;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState(0);

  const initializeAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(audio.filePath);
      setSound(newSound);

      const status = await newSound.playAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) =>
        handlePlaybackStatusUpdate(status)
      );
    } catch (error) {
      console.error('Error loading afirmasi audio:', error);
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setSliderValue(status.positionMillis || 0);

      if (status.didJustFinish) {
        resetPlayback();
      }
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setSliderValue(0);
  };

  const cleanupAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  };

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

  const handleSliderComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  useEffect(() => {
    if (visible) {
      initializeAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/afirmasiHarianBackground.png')}
          style={styles.coverImage}
        />
        <Text style={[TEXT_STYLES.sectionTitle, styles.audioTitle]}>
          {audio.title}
        </Text>
        <Text style={styles.artistName}>By Tenangkan</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={sliderValue}
            onSlidingComplete={handleSliderComplete}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor="#999"
            thumbTintColor={COLORS.primary}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{Math.floor(sliderValue / 1000)}</Text>
            <Text style={styles.timeText}>{Math.floor(duration / 1000)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Text style={styles.playPauseButtonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
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
