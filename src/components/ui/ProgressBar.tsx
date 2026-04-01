import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 8 }) => {
  const getProgressColor = () => {
    if (progress > 0.9) return theme.colors.error;
    if (progress > 0.7) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <View style={[styles.container, { height }]}>
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.min(100, Math.max(0, progress * 100))}%`,
              backgroundColor: getProgressColor(),
              height
            }
          ]}
        />
      </View>
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
