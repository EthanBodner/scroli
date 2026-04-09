import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 8 }) => {
  const [containerWidth, setContainerWidth] = React.useState(0);

  const getProgressColor = () => {
    if (progress > 0.9) return theme.colors.error;
    if (progress > 0.7) return theme.colors.warning;
    return theme.colors.teal;
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const progressWidth = Math.max(0, Math.min(containerWidth, containerWidth * progress));

  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      <View
        style={[
          styles.progress,
          {
            width: progressWidth,
            backgroundColor: getProgressColor(),
            height
          }
        ]}
      />
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
