// pencapaianScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './theme';

const PencapaianScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pancapaian Screen</Text>
      <Text style={styles.description}>
        This is the Pancapaian screen content.
      </Text>
    </View>
  );
};

export default PencapaianScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
  },
});
