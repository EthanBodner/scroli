import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 8 }) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 });
  }, [progress, animatedProgress]);

  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      animatedProgress.value,
      [0, 0.7, 0.9, 1],
      [
        theme.colors.success,
        theme.colors.success,
        theme.colors.warning,
        theme.colors.error,
      ]
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
      backgroundColor: progressColor.value,
    };
  });

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={[styles.progress, animatedStyle, { height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: theme.borderRadius.full,
  },
});
