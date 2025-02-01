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
  // Playback states
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sound = useRef<Audio.Sound | null>(null);
  const currentAudio = audios[currentAudioIndex];

  // Toggle states for random and repeat
  const [randomActive, setRandomActive] = useState(false);
  const [repeatActive, setRepeatActive] = useState(false);

  const toggleRandom = () => {
    if (!randomActive) {
      setRepeatActive(false);
      setRandomActive(true);
    } else {
      setRandomActive(false);
    }
  };

  const toggleRepeat = () => {
    if (!repeatActive) {
      setRandomActive(false);
      setRepeatActive(true);
    } else {
      setRepeatActive(false);
    }
  };

  /**
   * Loads and plays the selected audio.
   */
  const loadAndPlayAudio = async (audio: AudioItem) => {
    try {
      // If there is a previous sound, stop and unload it.
      if (sound.current) {
        sound.current.setOnPlaybackStatusUpdate(null);
        await sound.current.stopAsync().catch(() => {});
        await sound.current.unloadAsync().catch(() => {});
        sound.current = null;
      }

      const newSound = new Audio.Sound();
      sound.current = newSound;
      setIsLoading(true);

      await newSound.loadAsync(audio.filePath);
      const status = await newSound.getStatusAsync();

      if (status.isLoaded) {
        setDuration((status.durationMillis || 0) / 1000);
        setCurrentPosition(0);
        setIsPlaying(false);

        // Listen for playback status updates.
        newSound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
              Alert.alert('Playback Error', playbackStatus.error);
            }
            return;
          }

          setCurrentPosition((playbackStatus.positionMillis || 0) / 1000);

          // When the audio finishes playing:
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            if (repeatActive) {
              newSound.setPositionAsync(0).then(() => {
                newSound.playAsync();
                setIsPlaying(true);
              });
            } else if (!randomActive) {
              onAudioChange((currentAudioIndex + 1) % audios.length);
            }
            // Note: If random is active, finishing the track does not auto-play.
          }
        });

        // Start playback.
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
   * Load and play audio when modal becomes visible or when the audio changes.
   * Also, cleanup when the modal is closed.
   */
  useEffect(() => {
    if (visible && currentAudio) {
      loadAndPlayAudio(currentAudio);
    }
    return () => {
      if (sound.current) {
        sound.current.setOnPlaybackStatusUpdate(null);
        sound.current.stopAsync().catch(() => {});
        sound.current.unloadAsync().catch(() => {});
        sound.current = null;
      }
      setCurrentPosition(0);
      setDuration(0);
      setIsPlaying(false);
      setIsLoading(true);
    };
  }, [visible, currentAudio]);

  /**
   * Toggle play/pause.
   */
  const playPauseAudio = async () => {
    if (!sound.current) {
      return;
    }

    try {
      const status = await sound.current.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error: any) {
      if (error.message && error.message.includes('Player does not exist')) {
        return;
      }
      console.error('Error toggling play/pause:', error);
      Alert.alert('Error', 'There was a problem toggling play/pause.');
    }
  };

  /**
   * Seek in the audio when the slider is moved.
   * Added a check for whether the player is loaded to prevent errors.
   */
  const handleSliderChange = async (value: number) => {
    if (!sound.current) {
      Alert.alert('Error', 'Audio is not loaded yet.');
      return;
    }
    try {
      // Ensure that the sound is loaded before seeking.
      const status = await sound.current.getStatusAsync();
      if (!status.isLoaded) {
        return;
      }
      await sound.current.setPositionAsync(value * 1000);
      setCurrentPosition(value);
    } catch (error: any) {
      if (error.message && error.message.includes('Player does not exist')) {
        console.warn('Player does not exist. Seek operation aborted.');
        return;
      }
      console.error('Error seeking audio:', error);
      Alert.alert('Error', 'There was a problem seeking the audio.');
    }
  };

  /**
   * Handle playing the next audio.
   */
  const handleNextAudio = () => {
    if (randomActive) {
      let nextIndex = Math.floor(Math.random() * audios.length);
      if (audios.length > 1) {
        while (nextIndex === currentAudioIndex) {
          nextIndex = Math.floor(Math.random() * audios.length);
        }
      }
      onAudioChange(nextIndex);
    } else {
      const nextIndex = (currentAudioIndex + 1) % audios.length;
      onAudioChange(nextIndex);
    }
  };

  /**
   * Handle playing the previous audio.
   */
  const handlePreviousAudio = () => {
    if (randomActive) {
      let prevIndex = Math.floor(Math.random() * audios.length);
      if (audios.length > 1) {
        while (prevIndex === currentAudioIndex) {
          prevIndex = Math.floor(Math.random() * audios.length);
        }
      }
      onAudioChange(prevIndex);
    } else {
      const previousIndex = (currentAudioIndex - 1 + audios.length) % audios.length;
      onAudioChange(previousIndex);
    }
  };

  /**
   * Format seconds into MM:SS.
   */
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  /**
   * Get the style for toggle buttons.
   */
  const toggleButtonStyle = (active: boolean) => [
    styles.toggleButtonContainer,
    {
      backgroundColor: active ? COLORS.primary : 'transparent',
      borderWidth: active ? 1 : 0,
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Close Button */}
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
            {/* Album Art */}
            {currentAudio?.image && (
              <Image source={currentAudio.image} style={styles.albumArt} />
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

            {/* Control Row: Random – Previous – Play/Pause – Next – Repeat */}
            <View style={styles.controlContainer}>
              {/* Random Button */}
              <TouchableOpacity onPress={toggleRandom} disabled={isLoading}>
                <View style={toggleButtonStyle(randomActive)}>
                  <Image
                    source={require('../../assets/images/buttons/randomButton.png')}
                    style={styles.toggleButtonIcon}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ width: 40 }} />

              {/* Previous Button */}
              <TouchableOpacity onPress={handlePreviousAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/previousButton.png')}
                  style={[styles.mediumButtonIcon, isLoading && { opacity: 0.5 }]}
                />
              </TouchableOpacity>

              <View style={{ width: 20 }} />

              {/* Play/Pause Button */}
              <TouchableOpacity onPress={playPauseAudio} disabled={isLoading}>
                <Image
                  source={
                    isPlaying
                      ? require('../../assets/images/buttons/pauseButton.png')
                      : require('../../assets/images/buttons/playButton.png')
                  }
                  style={[styles.largeButtonIcon, isLoading && { opacity: 0.5 }]}
                />
              </TouchableOpacity>

              <View style={{ width: 20 }} />

              {/* Next Button */}
              <TouchableOpacity onPress={handleNextAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/nextButton.png')}
                  style={[styles.mediumButtonIcon, isLoading && { opacity: 0.5 }]}
                />
              </TouchableOpacity>

              <View style={{ width: 40 }} />

              {/* Repeat Button */}
              <TouchableOpacity onPress={toggleRepeat} disabled={isLoading}>
                <View style={toggleButtonStyle(repeatActive)}>
                  <Image
                    source={require('../../assets/images/buttons/repeatButton.png')}
                    style={styles.toggleButtonIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default AfirmasiHarianModal;

// -- Styles --
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'flex-start', // Push content to the top
    paddingTop: 20, // Reduced padding to move content upward
  },
  closeButton: {
    position: 'absolute',
    top: 10, // Positioned at the top left corner
    left: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15, // Reduced border radius for a smaller button
    width: 30, // Smaller width
    height: 30, // Smaller height
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: '90%',
    height: 25,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '81%',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.black,
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButtonContainer: {
    width: 30, // Reduced size for random & repeat buttons
    height: 30,
    borderRadius: 6,
    overflow: 'hidden',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonIcon: {
    width: 20, // Reduced icon size
    height: 20,
    resizeMode: 'contain',
  },
  mediumButtonIcon: {
    width: 30, // Reduced size for next/previous buttons
    height: 30,
    resizeMode: 'contain',
  },
  largeButtonIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
