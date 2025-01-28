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
  // -- Playback states --
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sound = useRef<Audio.Sound | null>(null);
  const currentAudio = audios[currentAudioIndex];

  // -- New buttons toggle states --
  const [randomActive, setRandomActive] = useState(false);
  const [repeatActive, setRepeatActive] = useState(false);
  const [autoPlayActive, setAutoPlayActive] = useState(false);

  /**
   * If enabling random while repeat is active, disable repeat.
   */
  const toggleRandom = () => {
    if (!randomActive) {
      // Turn on random => turn off repeat
      setRepeatActive(false);
      setRandomActive(true);
    } else {
      // Turn off random
      setRandomActive(false);
    }
  };

  /**
   * If enabling repeat while random is active, disable random.
   */
  const toggleRepeat = () => {
    if (!repeatActive) {
      // Turn on repeat => turn off random
      setRandomActive(false);
      setRepeatActive(true);
    } else {
      // Turn off repeat
      setRepeatActive(false);
    }
  };

  /**
   * Autoplay can be enabled regardless of random/repeat states.
   */
  const toggleAutoPlay = () => {
    setAutoPlayActive((prev) => !prev);
  };

  /**
   * Loads and plays the selected audio automatically.
   */
  const loadAndPlayAudio = async (audio: AudioItem) => {
    try {
      if (sound.current) {
        await sound.current.stopAsync().catch(() => {});
        await sound.current.unloadAsync().catch(() => {});
        sound.current = null;
      }

      const newSound = new Audio.Sound();
      sound.current = newSound;

      await newSound.loadAsync(audio.filePath);

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

          setCurrentPosition((playbackStatus.positionMillis || 0) / 1000);

          // If audio finished playing, stop it so it doesn't restart automatically
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            newSound.stopAsync();
            setIsPlaying(false);
            setCurrentPosition(0);
            // Would normally handle random/repeat/autoplay logic here
            // but we are only implementing the appearance/toggle states, not the full logic.
          }
        });

        // Automatically start playing
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
    // Cleanup on close/unmount
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
   * Toggle play/pause.
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
   * Seeks in the audio when user drags the slider.
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

  /**
   * Helper to get the container style for small toggle buttons (random, repeat, autoplay).
   */
  const toggleButtonStyle = (active: boolean) => [
    styles.toggleButtonContainer,
    { backgroundColor: active ? COLORS.primary : 'transparent' },
  ];

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

            {/* Control Row: random -- prev -- play -- next -- repeat */}
            <View style={styles.controlContainer}>
              {/* Random Button (far left) */}
              <TouchableOpacity onPress={toggleRandom} disabled={isLoading}>
                <View style={toggleButtonStyle(randomActive)}>
                  <Image
                    source={require('../../assets/images/buttons/randomButton.png')}
                    style={styles.toggleButtonIcon}
                  />
                </View>
              </TouchableOpacity>

              {/* Big gap before previous */}
              <View style={{ width: 40 }} />

              {/* Previous Button (medium) */}
              <TouchableOpacity onPress={handlePreviousAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/previousButton.png')}
                  style={[styles.mediumButtonIcon, isLoading && { opacity: 0.5 }]}
                />
              </TouchableOpacity>

              {/* Small gap */}
              <View style={{ width: 20 }} />

              {/* Play/Pause (largest) */}
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

              {/* Small gap */}
              <View style={{ width: 20 }} />

              {/* Next Button (medium) */}
              <TouchableOpacity onPress={handleNextAudio} disabled={isLoading}>
                <Image
                  source={require('../../assets/images/buttons/nextButton.png')}
                  style={[styles.mediumButtonIcon, isLoading && { opacity: 0.5 }]}
                />
              </TouchableOpacity>

              {/* Big gap */}
              <View style={{ width: 40 }} />

              {/* Repeat Button (far right) */}
              <TouchableOpacity onPress={toggleRepeat} disabled={isLoading}>
                <View style={toggleButtonStyle(repeatActive)}>
                  <Image
                    source={require('../../assets/images/buttons/repeatButton.png')}
                    style={styles.toggleButtonIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* AutoPlay Container (icon + text clickable) */}
            <TouchableOpacity
              style={styles.autoplayContainer}
              onPress={toggleAutoPlay}
              disabled={isLoading}
            >
              <View style={toggleButtonStyle(autoPlayActive)}>
                <Image
                  source={require('../../assets/images/buttons/autoPlayButton.png')}
                  style={styles.toggleButtonIcon}
                />
              </View>
              <Text style={styles.autoplayLabel}>
                {autoPlayActive ? 'Autoplay is on' : 'Autoplay is off'}
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
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
    height: 40,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.black,
  },
  // The main row for random - previous - play - next - repeat
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  /**
   * Smallest toggle buttons (random/repeat/autoplay).
   * We add borderRadius & overflow so corners are visible.
   */
  toggleButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1, // optional for more visible corners
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  // Next/Previous: medium
  mediumButtonIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // Play/Pause: largest
  largeButtonIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // Autoplay row - we wrap icon + text in one pressable
  autoplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  autoplayLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.black,
  },
});
