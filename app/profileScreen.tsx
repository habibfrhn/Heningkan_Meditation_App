import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './theme';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Komunitas Screen</Text>
      <Text style={styles.description}>
        This is the Komunitas screen content.
      </Text>
    </View>
  );
};

export default ProfileScreen;

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
