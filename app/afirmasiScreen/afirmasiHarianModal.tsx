// Path: /components/AfirmasiHarianModal.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { COLORS } from '../theme';
import { AudioItem } from './audioManagerAfirmasi';

interface AfirmasiHarianModalProps {
  visible: boolean;
  onClose: () => void;
  audios: AudioItem[];
  currentAudioIndex: number;
  onAudioChange: (index: number) => void;
}

const AfirmasiHarianModal: React.FC<AfirmasiHarianModalProps> = ({
  visible,
  onClose,
  audios,
  currentAudioIndex,
  onAudioChange,
}) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sound = useRef<Audio.Sound | null>(null);

  const currentAudio = audios[currentAudioIndex];

  /**
   * Loads and plays the selected audio.
   * Ensures that any existing audio is stopped and unloaded before loading the new one.
   */
  const loadAndPlayAudio = async (audio: AudioItem) => {
    try {
      // If an audio is already playing, stop and unload it
      if (sound.current) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
        sound.current = null;
      }

      // Initialize a new sound instance
      const newSound = new Audio.Sound();
      sound.current = newSound;

      // Load the selected audio
      await newSound.loadAsync(audio.filePath);

      // Get the duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration((status.durationMillis || 0) / 1000);
        setIsPlaying(false);
        setCurrentPosition(0);

        // Set up a listener for playback status updates
        newSound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
              Alert.alert('Playback Error', playbackStatus.error);
            }
            return;
          }

          setCurrentPosition((playbackStatus.positionMillis || 0) / 1000);

          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            handleNextAudio();
          }
        });

        // Start playing the audio
        await newSound.playAsync();
        setIsPlaying(true);
      } else {
        Alert.alert('Error', 'Failed to load the audio.');
      }
    } catch (error) {
      console.error('Error loading or playing audio:', error);
      Alert.alert('Error', 'There was a problem playing the audio.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && currentAudio) {
      setIsLoading(true);
      loadAndPlayAudio(currentAudio);
    }

    // Cleanup function to stop and unload audio when modal is closed or component unmounts
    return () => {
      if (sound.current) {
        sound.current.stopAsync().catch((error) => console.error('Error stopping audio:', error));
        sound.current.unloadAsync().catch((error) => console.error('Error unloading audio:', error));
        sound.current = null;
      }
      setCurrentPosition(0);
      setDuration(0);
      setIsPlaying(false);
      setIsLoading(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentAudio]);

  /**
   * Toggles play and pause for the current audio.
   */
  const playPauseAudio = async () => {
    if (!sound.current) {
      Alert.alert('Error', 'Audio is not loaded yet.');
      return;
    }

    try {
      const status = await sound.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.current.playAsync();
          setIsPlaying(true);
        }
      } else {
        Alert.alert('Error', 'Audio is not loaded.');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      Alert.alert('Error', 'There was a problem toggling play/pause.');
    }
  };

  /**
   * Handles slider value changes to seek within the audio.
   * @param value The new slider value.
   */
  const handleSliderChange = async (value: number) => {
    if (!sound.current) {
      Alert.alert('Error', 'Audio is not loaded yet.');
      return;
    }

    try {
      await sound.current.setPositionAsync(value * 1000);
      setCurrentPosition(value);
    } catch (error) {
      console.error('Error seeking audio:', error);
      Alert.alert('Error', 'There was a problem seeking the audio.');
    }
  };

  /**
   * Moves to the next audio in the collection.
   */
  const handleNextAudio = () => {
    const nextIndex = (currentAudioIndex + 1) % audios.length;
    onAudioChange(nextIndex);
  };

  /**
   * Moves to the previous audio in the collection.
   */
  const handlePreviousAudio = () => {
    const previousIndex = (currentAudioIndex - 1 + audios.length) % audios.length;
    onAudioChange(previousIndex);
  };

  /**
   * Formats time in seconds to MM:SS format.
   * @param time Time in seconds.
   * @returns Formatted time string.
   */
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Memuat Afirmasi...</Text>
          </View>
        ) : (
          <>
            {currentAudio.image && (
              <Image source={currentAudio.image} style={styles.image} />
            )}
            <Text style={styles.title}>{currentAudio.title}</Text>
            <Text style={styles.artist}>{currentAudio.artist}</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentPosition}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.black}
              thumbTintColor={COLORS.primary}
              disabled={isLoading}
            />

            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controlContainer}>
              <TouchableOpacity onPress={handlePreviousAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/previousButton.png')}
                  style={[styles.controlButton, isLoading && styles.disabledButton]}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={playPauseAudio} disabled={isLoading}>
                <Image
                  source={
                    isPlaying
                      ? require('../../assets/images/buttons/pauseButton.png')
                      : require('../../assets/images/buttons/playButton.png')
                  }
                  style={[styles.controlButton, isLoading && styles.disabledButton]}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNextAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/nextButton.png')}
                  style={[styles.controlButton, isLoading && styles.disabledButton]}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Adjusted for better placement
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18, // Increased font size for better visibility
    fontWeight: 'bold',
  },
  image: {
    width: 220, // Increased size for better visibility
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26, // Increased font size
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  artist: {
    fontSize: 20, // Increased font size
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: '90%',
    height: 40,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20, // Added margin for spacing
  },
  timeText: {
    fontSize: 16, // Increased font size
    color: COLORS.black,
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  controlButton: {
    width: 60, // Increased size for better touch targets
    height: 60,
    marginHorizontal: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.black,
  },
});

export default AfirmasiHarianModal;
