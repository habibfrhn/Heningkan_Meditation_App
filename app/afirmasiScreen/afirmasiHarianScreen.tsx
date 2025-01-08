import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AfirmasiHarianModal from './afirmasiHarianModal';
import { COLORS, TEXT_STYLES } from '../theme';
import { fetchAudioMetadata } from './audioManagerAfirmasi';

export interface AudioItem {
  id: string;
  title: string;
  duration: string;
  filePath: any;
}

export interface Collection {
  id: string;
  name: string;
  audios: AudioItem[];
}

const AfirmasiHarianScreen: React.FC = () => {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Load audio metadata when the screen is mounted
  useEffect(() => {
    const initializeAudios = async () => {
      setLoading(true);
      const audioCollection = await fetchAudioMetadata();
      setAudios(audioCollection.audios);
      setLoading(false);
    };
    initializeAudios();
  }, []);

  // Open modal to play audio
  const openModal = (audio: AudioItem) => {
    setSelectedAudio(audio);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedAudio(null);
  };

  // Render each audio item
  const renderAudioItem = ({ item }: { item: AudioItem }) => (
    <TouchableOpacity style={styles.audioItem} onPress={() => openModal(item)}>
      <View>
        <Text style={styles.audioTitle}>{item.title}</Text>
        <Text style={styles.audioArtist}>By Tenangkan</Text>
      </View>
      <Text style={styles.audioDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[TEXT_STYLES.heading, styles.header]}>
        Pilih afirmasi yang kamu inginkan
      </Text>

      {isLoading ? (
        // Show loading indicator while audios are being fetched
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={audios}
          keyExtractor={(audio) => audio.id}
          renderItem={renderAudioItem}
        />
      )}

      {selectedAudio && (
        <AfirmasiHarianModal
          visible={isModalVisible}
          onClose={closeModal}
          audio={selectedAudio}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  audioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  audioTitle: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  audioArtist: {
    fontSize: 12,
    color: '#777',
  },
  audioDuration: {
    fontSize: 12,
    color: COLORS.black,
  },
});

export default AfirmasiHarianScreen;
