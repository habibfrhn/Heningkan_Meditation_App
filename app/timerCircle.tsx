import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from './theme';

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 13;
const RADIUS_BACKGROUND = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const RADIUS_PRIMARY = (CIRCLE_SIZE - 1.6 * STROKE_WIDTH) / 2;
const CENTER = CIRCLE_SIZE / 2;

interface TimerCircleProps {
  selectedTime: number;
  maxDuration: number;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ selectedTime, maxDuration }) => (
  <View style={styles.container}>
    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_BACKGROUND}
        stroke={theme.COLORS.background}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_PRIMARY}
        stroke={theme.COLORS.primary}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
    </Svg>
    <View style={styles.innerCircle}>
      <Text style={styles.textSmall}>Your timer is set to</Text>
      <Text style={styles.textLarge}>{Math.round(selectedTime)} min</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  innerCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE - 2 * (STROKE_WIDTH + 15),
    height: CIRCLE_SIZE - 2 * (STROKE_WIDTH + 15),
    borderRadius: (CIRCLE_SIZE - 2 * (STROKE_WIDTH + 10)) / 2,
    backgroundColor: theme.COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSmall: { fontSize: 14, color: theme.COLORS.black, textAlign: 'center' },
  textLarge: { fontSize: 32, fontWeight: 'bold', color: theme.COLORS.primary, textAlign: 'center', marginTop: 5 },
});

export default TimerCircle;
