// Path: /screens/AfirmasiHarianScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AfirmasiHarianModal from './afirmasiHarianModal';
import { fetchAudioMetadata, AudioItem } from './audioManagerAfirmasi';
import { COLORS } from '../theme';

const AfirmasiHarianScreen: React.FC = () => {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudios = async () => {
      try {
        const metadata = await fetchAudioMetadata();
        if (metadata.length === 0) {
          Alert.alert('Error', 'No audio files found.');
        }
        setAudios(metadata || []);
      } catch (error) {
        console.error('Error fetching audio metadata:', error);
        Alert.alert('Error', 'There was a problem loading audio files.');
      } finally {
        setLoading(false);
      }
    };
    loadAudios();
  }, []);

  /**
   * Handles the selection of an audio item.
   * @param index The index of the selected audio in the audios array.
   */
  const handleSelectAudio = (index: number) => {
    setCurrentAudioIndex(index);
    setModalVisible(true);
  };

  /**
   * Handles the closure of the modal.
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentAudioIndex(null);
  };

  /**
   * Updates the current audio index based on user navigation (next/previous).
   * @param index The new index to set as the current audio.
   */
  const handleAudioChange = (index: number) => {
    setCurrentAudioIndex(index);
  };

  /**
   * Renders each audio item in the FlatList.
   */
  const renderAudioItem = ({ item, index }: { item: AudioItem; index: number }) => (
    <TouchableOpacity onPress={() => handleSelectAudio(index)}>
      <View
        style={[
          styles.audioItem,
          currentAudioIndex === index && styles.selectedAudioItem,
        ]}
      >
        <Image source={item.image} style={styles.audioImage} />
        <View style={styles.audioTextContainer}>
          <Text style={styles.audioTitle}>{item.title}</Text>
          <Text style={styles.audioArtist}>{item.artist}</Text>
        </View>
        <Text style={styles.audioDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Key extractor for FlatList items.
   */
  const keyExtractor = (item: AudioItem) => item.id;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat Afirmasi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Afirmasi Harianmu</Text>
      <FlatList
        data={audios}
        renderItem={renderAudioItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada afirmasi tersedia.</Text>
          </View>
        }
      />
      {currentAudioIndex !== null && (
        <AfirmasiHarianModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          audios={audios}
          currentAudioIndex={currentAudioIndex}
          onAudioChange={handleAudioChange}
        />
      )}
    </View>
  );
};

export default AfirmasiHarianScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    paddingTop: 40, // Adjusted for better spacing
  },
  header: {
    fontSize: 24, // Increased for better visibility
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'left',
  },
  listContainer: {
    paddingBottom: 20,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  selectedAudioItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#f0f8ff', // Light highlight color
  },
  audioImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  audioTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  audioArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  audioDuration: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
    textAlign: 'right',
  },
  separator: {
    height: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
