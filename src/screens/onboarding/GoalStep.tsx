import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';
import { useOnboardingStore } from '../../stores/onboardingStore';

const MIN_HOURS = 0.5;
const MAX_HOURS = 8;
const STEP = 0.5;

export const GoalStep: React.FC = () => {
  const { dailyGoalHours, setDailyGoalHours } = useOnboardingStore();

  const decrement = () =>
    setDailyGoalHours(Math.max(MIN_HOURS, Math.round((dailyGoalHours - STEP) * 10) / 10));
  const increment = () =>
    setDailyGoalHours(Math.min(MAX_HOURS, Math.round((dailyGoalHours + STEP) * 10) / 10));

  return (
    <View style={styles.container}>
      <Mascot size={200} usagePercent={0.5} />

      <Text style={styles.title}>Set Your Daily Goal</Text>
      <Text style={styles.subtitle}>How many hours of screen time is your daily limit?</Text>

      <View style={styles.pickerRow}>
        <Pressable
          style={[styles.stepButton, dailyGoalHours <= MIN_HOURS && styles.stepButtonDisabled]}
          onPress={decrement}
          disabled={dailyGoalHours <= MIN_HOURS}
        >
          <Ionicons
            name="remove"
            size={28}
            color={dailyGoalHours <= MIN_HOURS ? theme.colors.text.light : theme.colors.primary}
          />
        </Pressable>

        <View style={styles.valueContainer}>
          <Text style={styles.goalNumber}>{dailyGoalHours.toFixed(1)}</Text>
          <Text style={styles.goalLabel}>hours / day</Text>
        </View>

        <Pressable
          style={[styles.stepButton, dailyGoalHours >= MAX_HOURS && styles.stepButtonDisabled]}
          onPress={increment}
          disabled={dailyGoalHours >= MAX_HOURS}
        >
          <Ionicons
            name="add"
            size={28}
            color={dailyGoalHours >= MAX_HOURS ? theme.colors.text.light : theme.colors.primary}
          />
        </Pressable>
      </View>

      <Text style={styles.description}>
        3.0 hours is a healthy starting point.{'\n'}
        You can change this any time in Settings.
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
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 120,
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
    marginTop: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
