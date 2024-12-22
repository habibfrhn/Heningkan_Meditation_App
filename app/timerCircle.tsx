import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import theme from './theme';

// Helper functions
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const calculateAngle = (x: number, y: number, centerX: number, centerY: number) => {
  const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
  return angle < 0 ? angle + 360 : angle;
};

// Component Constants
const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CENTER = CIRCLE_SIZE / 2;
const circumference = 2 * Math.PI * RADIUS;

interface TimerCircleProps {
  selectedTime: number;
  setSelectedTime: (time: number) => void;
  maxDuration?: number;
}

const TimerCircle: React.FC<TimerCircleProps> = ({
  selectedTime,
  setSelectedTime,
  maxDuration = 60,
}) => {
  const animatedValue = useRef(new Animated.Value((selectedTime / maxDuration) * 359)).current;
  const [hasReachedMax, setHasReachedMax] = useState(false);
  const [previousAngle, setPreviousAngle] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => handleGesture(evt.nativeEvent),
    })
  ).current;

  const angle = (selectedTime / maxDuration) * 359;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: angle,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [angle]);

  const handleGesture = ({ locationX, locationY }: any) => {
    let calculatedAngle = calculateAngle(locationX, locationY, CENTER, CENTER);

    // If max is reached and movement is decreasing, prevent the update
    if (hasReachedMax && calculatedAngle < previousAngle) {
      return;
    }

    // Constrain angle to a maximum of 359 degrees
    if (calculatedAngle >= 359) {
      calculatedAngle = 359;
      setHasReachedMax(true);
    } else {
      setHasReachedMax(false);
    }

    setPreviousAngle(calculatedAngle);

    // Map angle to time
    const newTime = Math.round((calculatedAngle / 359) * maxDuration);
    setSelectedTime(Math.max(1, newTime));
  };

  return (
    <View style={styles.timerCircle}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={theme.COLORS.background}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={theme.COLORS.primary}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${(angle / 359) * circumference} ${circumference}`}
            strokeLinecap="round"
            fill="none"
          />
          <Circle
            cx={CENTER + RADIUS * Math.cos(degToRad(angle))}
            cy={CENTER + RADIUS * Math.sin(degToRad(angle))}
            r={12}
            fill={theme.COLORS.primary}
          />
        </G>
        <G {...panResponder.panHandlers}>
          <Circle cx={CENTER} cy={CENTER} r={RADIUS + STROKE_WIDTH} fill="transparent" />
        </G>
      </Svg>
      <View style={styles.innerCircle}>
        <Text style={styles.timerTextSmall}>Your timer is set to</Text>
        <Text style={styles.timerTextLarge}>{selectedTime} min</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
