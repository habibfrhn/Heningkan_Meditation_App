import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from './theme';

const STROKE_WIDTH = 10;
const CIRCLE_SIZE = 220; // Circle size
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CENTER = CIRCLE_SIZE / 2;

interface TimerCircleProps {
  selectedTime?: number; // Current selected time
  setSelectedTime?: React.Dispatch<React.SetStateAction<number>>; // Update function for selected time
  maxDuration?: number; // Optional max duration for reference
}

const TimerCircle: React.FC<TimerCircleProps> = ({
  selectedTime = 20,
  setSelectedTime,
  maxDuration,
}) => {
  return (
    <View style={styles.timerCircleContainer}>
      <View style={styles.timerCircle}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {/* Full Circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={theme.COLORS.primary}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
        </Svg>
        {/* Inner Circle with Text */}
        <View style={styles.innerCircle}>
          <Text style={styles.timerTextSmall}>Your timer is set to</Text>
          <Text style={styles.timerTextLarge}>{Math.round(selectedTime)} min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerTextSmall: {
    fontSize: 14,
    color: theme.COLORS.black,
    textAlign: 'center',
  },
  timerTextLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default TimerCircle;
