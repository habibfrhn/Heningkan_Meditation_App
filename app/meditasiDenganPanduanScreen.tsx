// meditasiDenganPanduanScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TEXT_STYLES } from './theme';

const MeditasiDenganPanduanScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={[TEXT_STYLES.heading, { color: COLORS.black }]}>
        Meditasi dengan Panduan
      </Text>
      <Text style={[TEXT_STYLES.body, { marginTop: 10 }]}>
        Konten meditasi dengan panduan akan ditampilkan di sini.
      </Text>
    </View>
  );
};

export default MeditasiDenganPanduanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
