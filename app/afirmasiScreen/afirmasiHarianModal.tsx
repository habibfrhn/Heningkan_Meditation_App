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
   * Loads and plays the selected audio automatically.
   * Ensures any existing audio is stopped/unloaded before loading the new one.
   */
  const loadAndPlayAudio = async (audio: AudioItem) => {
    try {
      // Stop/unload any existing audio
      if (sound.current) {
        await sound.current.stopAsync().catch(() => {});
        await sound.current.unloadAsync().catch(() => {});
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
        setCurrentPosition(0);
        setIsPlaying(false);

        // Listen for playback status updates
        newSound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
              Alert.alert('Playback Error', playbackStatus.error);
            }
            return;
          }

          // Update current position
          setCurrentPosition((playbackStatus.positionMillis || 0) / 1000);

          // If audio finished playing, stop it to avoid auto replay
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            // Explicitly stop, ensuring no auto-restart
            newSound.stopAsync(); 
            setIsPlaying(false);
            setCurrentPosition(0);
          }
        });

        // Automatically start playing the audio
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

  /**
   * Whenever the modal is open with a valid audio, load & play that audio.
   */
  useEffect(() => {
    if (visible && currentAudio) {
      setIsLoading(true);
      loadAndPlayAudio(currentAudio);
    }

    // Cleanup: stop/unload audio when modal closes or component unmounts
    return () => {
      if (sound.current) {
        sound.current.stopAsync().catch(() => {});
        sound.current.unloadAsync().catch(() => {});
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
   * Toggles play/pause.
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
   * Seeks within the audio when user drags the slider.
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
   * Move to the next audio in the list.
   */
  const handleNextAudio = () => {
    const nextIndex = (currentAudioIndex + 1) % audios.length;
    onAudioChange(nextIndex);
  };

  /**
   * Move to the previous audio in the list.
   */
  const handlePreviousAudio = () => {
    const previousIndex = (currentAudioIndex - 1 + audios.length) % audios.length;
    onAudioChange(previousIndex);
  };

  /**
   * Format time (seconds) to MM:SS.
   */
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>

        {isLoading ? (
          // Loading Screen
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Memuat Afirmasi...</Text>
          </View>
        ) : (
          <>
            {/* Audio Image */}
            {currentAudio?.image && (
              <Image source={currentAudio.image} style={styles.image} />
            )}

            {/* Title & Artist */}
            <Text style={styles.title}>{currentAudio?.title}</Text>
            <Text style={styles.artist}>{currentAudio?.artist}</Text>

            {/* Slider */}
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

            {/* Time Display */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Controls */}
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

export default AfirmasiHarianModal;

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
    top: 40,
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
    fontSize: 18,
    fontWeight: 'bold',
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
  image: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  artist: {
    fontSize: 20,
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
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    color: COLORS.black,
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    marginHorizontal: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
