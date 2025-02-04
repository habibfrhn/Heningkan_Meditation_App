// Path: /screens/AfirmasiHarianScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
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
import AfirmasiHarianModal from './afirmasiHarianModal'; // <- Adjust path if needed
import { fetchAudioMetadata, AudioItem } from './audioManagerAfirmasi'; // <- Adjust path if needed
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
        if (!metadata.length) {
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

  const handleSelectAudio = (index: number) => {
    setCurrentAudioIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentAudioIndex(null);
  };

  const handleAudioChange = (index: number) => {
    setCurrentAudioIndex(index);
  };

  const renderAudioItem = useCallback(
    ({ item, index }: { item: AudioItem; index: number }) => (
      <TouchableOpacity onPress={() => handleSelectAudio(index)}>
        <View style={styles.audioItemWrapper}>
          <View
            style={[
              styles.audioItem,
              currentAudioIndex === index && isModalVisible && styles.selectedAudioItem,
            ]}
          >
            <Image source={item.image} style={styles.audioImage} />
            <View style={styles.audioTextContainer}>
              <Text style={styles.audioTitle}>{item.title}</Text>
              <Text style={styles.audioArtist}>{item.artist}</Text>
            </View>
            <Text style={styles.audioDuration}>{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [currentAudioIndex, isModalVisible]
  );

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
      <Text style={styles.header}>Plih afirmasi harianmu.</Text>

      <FlatList
        data={audios}
        renderItem={renderAudioItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
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
    paddingTop: 40,
  },
  header: {
    fontSize: 16, // Smaller header text
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  // Outer wrapper to control vertical spacing between each audio item.
  audioItemWrapper: {
    marginVertical: 4, // Tighter vertical gap between boxes
  },
  // Inner container with border radius and padding (shadow removed)
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5, // Reduced padding for a compact look
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  selectedAudioItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#f0f8ff',
  },
  audioImage: {
    width: 50, // Smaller image size
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  audioTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  audioArtist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  audioDuration: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
    textAlign: 'right',
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
