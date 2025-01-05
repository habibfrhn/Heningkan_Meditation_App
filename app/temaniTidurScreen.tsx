// temaniTidurScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TEXT_STYLES } from './theme';

const TemaniTidurScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={[TEXT_STYLES.heading, { color: COLORS.black }]}>
        Temani Tidur
      </Text>
      <Text style={[TEXT_STYLES.body, { marginTop: 10 }]}>
        Konten Temani Tidur akan ditampilkan di sini.
      </Text>
    </View>
  );
};

export default TemaniTidurScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
