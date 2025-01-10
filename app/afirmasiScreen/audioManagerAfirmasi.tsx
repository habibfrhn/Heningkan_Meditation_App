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
 * Fetches and returns the audio metadata as an array of AudioItem.
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

      await soundObject.unloadAsync(); // Unload after fetching metadata
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

  return audios.filter((audio) => audio.filePath !== null);
};
