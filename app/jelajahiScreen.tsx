// jelajahiScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './theme';

const JelajahiScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jelajahi Screen</Text>
      <Text style={styles.description}>
        This is the Jelajahi screen content.
      </Text>
    </View>
  );
};

export default JelajahiScreen;

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
