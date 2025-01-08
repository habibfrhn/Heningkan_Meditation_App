import { Audio } from 'expo-av';
import { Collection } from './afirmasiHarianScreen';

const audioFiles = {
  'Keindahan memaafkan': require('../../assets/audio/afirmasi/Keindahan memaafkan.mp3'),
  'Menarik energi baik': require('../../assets/audio/afirmasi/Menarik energi baik.mp3'),
  'Mencintai diri sendiri': require('../../assets/audio/afirmasi/Mencintai diri sendiri.mp3'),
  'Seni melepaskan': require('../../assets/audio/afirmasi/Seni melepaskan.mp3'),
};

const formatTime = (millis: number): string => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const fetchAudioMetadata = async (): Promise<Collection> => {
  const audios = await Promise.all(
    Object.entries(audioFiles).map(async ([title, file]) => {
      try {
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(file);
        const status = await soundObject.getStatusAsync();

        if (status.isLoaded) {
          return {
            id: title,
            title,
            duration: formatTime(status.durationMillis || 0),
            filePath: file,
          };
        } else {
          console.error(`Failed to load audio: ${title}`);
          return { id: title, title, duration: '0:00', filePath: null };
        }
      } catch (error) {
        console.error(`Error loading audio metadata for ${title}:`, error);
        return { id: title, title, duration: '0:00', filePath: null };
      }
    })
  );

  return {
    id: 'auto-added',
    name: 'Automatic Collection',
    audios,
  };
};
