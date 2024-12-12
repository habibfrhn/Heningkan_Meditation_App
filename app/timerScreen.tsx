import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  peach: '#FFB4A2',
};

const TimerScreen: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Timer</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default TimerScreen;
