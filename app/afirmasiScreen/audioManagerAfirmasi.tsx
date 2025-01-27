// Path: /components/audioManagerAfirmasi.tsx

import { Audio } from 'expo-av';

export interface AudioItem {
  id: string;
  title: string;
  duration: string;
  filePath: any;
  image: any;
  artist: string;
}

const defaultImage = require('../../assets/images/afirmasiHarianBackground.png');

// Map each audio title to its file path, image, and artist
const audioFiles: { [key: string]: { filePath: any; image: any; artist: string } } = {
  'Keindahan memaafkan': {
    filePath: require('../../assets/audio/afirmasi/Keindahan memaafkan.mp3'),
    image: defaultImage,
    artist: 'Pishi Yoga & Meditation',
  },
  'Menarik energi baik': {
    filePath: require('../../assets/audio/afirmasi/Menarik energi baik.mp3'),
    image: defaultImage,
    artist: 'Pishi Yoga & Meditation',
  },
  'Mencintai diri sendiri': {
    filePath: require('../../assets/audio/afirmasi/Mencintai diri sendiri.mp3'),
    image: defaultImage,
    artist: 'Pishi Yoga & Meditation',
  },
  'Seni melepaskan': {
    filePath: require('../../assets/audio/afirmasi/Seni melepaskan.mp3'),
    image: defaultImage,
    artist: 'Pishi Yoga & Meditation',
  },
};

const formatTime = (millis: number): string => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Fetches and returns audio metadata (ID, Title, Duration, etc.).
 * This preloads each audio briefly to get its duration, then unloads it.
 */
export const fetchAudioMetadata = async (): Promise<AudioItem[]> => {
  const audios: AudioItem[] = [];

  for (const [title, { filePath, image, artist }] of Object.entries(audioFiles)) {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(filePath);
      const status = await soundObject.getStatusAsync();

      if (status.isLoaded) {
        audios.push({
          id: title,
          title,
          duration: formatTime(status.durationMillis || 0),
          filePath,
          image,
          artist,
        });
      }
      // Unload after fetching metadata
      await soundObject.unloadAsync();
    } catch (error) {
      console.error(`Error loading audio metadata for "${title}":`, error);
      audios.push({
        id: title,
        title,
        duration: '0:00',
        filePath: null,
        image,
        artist,
      });
    }
  }

  // Filter out audios that failed to load (filePath null)
  return audios.filter((audio) => audio.filePath !== null);
};
