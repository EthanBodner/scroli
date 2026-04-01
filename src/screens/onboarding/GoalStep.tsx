import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { MAX_DAILY_HOURS } from '../../utils/constants';

export const GoalStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={{ width: 200, height: 200, backgroundColor: theme.colors.cream, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 80 }}>🎯</Text>
      </View>

      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>We recommend starting with</Text>

      <View style={styles.goalContainer}>
        <Text style={styles.goalNumber}>{MAX_DAILY_HOURS.toFixed(1)}</Text>
        <Text style={styles.goalLabel}>hours per day</Text>
      </View>

      <Text style={styles.description}>
        This is a healthy amount of screen time that still lets you stay connected without getting lost in the scroll.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  goalContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  goalNumber: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  goalLabel: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
