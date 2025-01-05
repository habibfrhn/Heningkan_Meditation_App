// afirmasiHarianScreen.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AfirmasiHarianModal from './afirmasiHarianModal'; // The modal component
import { COLORS, TEXT_STYLES } from './theme';

interface AudioItem {
  id: string;
  title: string;
  duration: string;
}

interface Collection {
  id: string;
  name: string;
  audios: AudioItem[];
}

const dummyCollections: Collection[] = [
  {
    id: '1',
    name: 'Pagi Hari',
    audios: [
      { id: 'a1', title: 'Afirmasi Pagi #1', duration: '3:12' },
      { id: 'a2', title: 'Afirmasi Pagi #2', duration: '4:01' },
    ],
  },
  {
    id: '2',
    name: 'Sore Hari',
    audios: [
      { id: 'b1', title: 'Afirmasi Sore #1', duration: '2:45' },
      { id: 'b2', title: 'Afirmasi Sore #2', duration: '3:30' },
    ],
  },
];

const AfirmasiHarianScreen: React.FC = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = (audio: AudioItem) => {
    setSelectedAudio(audio);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAudio(null);
  };

  const renderAudioItem = ({ item }: { item: AudioItem }) => (
    <TouchableOpacity style={styles.audioItem} onPress={() => openModal(item)}>
      <Text style={styles.audioTitle}>{item.title}</Text>
      <Text style={styles.audioDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  const renderCollection = ({ item }: { item: Collection }) => (
    <View style={styles.collectionContainer}>
      <Text style={styles.collectionName}>{item.name}</Text>
      <FlatList
        data={item.audios}
        keyExtractor={(audio) => audio.id}
        renderItem={renderAudioItem}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[TEXT_STYLES.heading, styles.header]}>
        Afirmasi Harian
      </Text>

      <FlatList
        data={dummyCollections}
        keyExtractor={(coll) => coll.id}
        renderItem={renderCollection}
      />

      {/* Modal */}
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
  },
  collectionContainer: {
    marginBottom: 20,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: COLORS.black,
  },
  audioItem: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  audioTitle: {
    fontSize: 14,
    color: COLORS.black,
  },
  audioDuration: {
    fontSize: 12,
    color: '#777',
  },
});

export default AfirmasiHarianScreen;
