import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';
import { useOnboardingStore, PeriodType } from '../../stores/onboardingStore';
import { PERIOD_CONFIG, PERIOD_TYPES } from '../../utils/goalPeriod';

export const GoalStep: React.FC = () => {
  const { dailyGoalHours, setDailyGoalHours, periodType, setPeriodType } = useOnboardingStore();
  const config = PERIOD_CONFIG[periodType];

  const handlePeriodChange = (p: PeriodType) => {
    setPeriodType(p);
    setDailyGoalHours(PERIOD_CONFIG[p].defaultHours);
  };

  const decrement = () =>
    setDailyGoalHours(Math.max(config.min, Math.round((dailyGoalHours - config.step) * 10) / 10));
  const increment = () =>
    setDailyGoalHours(Math.min(config.max, Math.round((dailyGoalHours + config.step) * 10) / 10));

  const atMin = dailyGoalHours <= config.min;
  const atMax = dailyGoalHours >= config.max;

  return (
    <View style={styles.container}>
      <Mascot size={160} usagePercent={0.5} />

      <Text style={styles.title}>Set Your Goal</Text>
      <Text style={styles.subtitle}>How much screen time are you allowed?</Text>

      {/* Period tabs */}
      <View style={styles.tabs}>
        {PERIOD_TYPES.map((p) => (
          <Pressable
            key={p}
            style={[styles.tab, periodType === p && styles.tabActive]}
            onPress={() => handlePeriodChange(p)}
          >
            <Text style={[styles.tabLabel, periodType === p && styles.tabLabelActive]}>
              {PERIOD_CONFIG[p].label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Picker */}
      <View style={styles.pickerRow}>
        <Pressable style={[styles.stepButton, atMin && styles.stepButtonDisabled]} onPress={decrement} disabled={atMin}>
          <Ionicons name="remove" size={28} color={atMin ? theme.colors.text.light : theme.colors.primary} />
        </Pressable>

        <View style={styles.valueContainer}>
          <Text style={styles.goalNumber}>
            {periodType === 'daily' ? dailyGoalHours.toFixed(1) : Math.round(dailyGoalHours)}
          </Text>
          <Text style={styles.goalLabel}>hours / {config.unit}</Text>
        </View>

        <Pressable style={[styles.stepButton, atMax && styles.stepButtonDisabled]} onPress={increment} disabled={atMax}>
          <Ionicons name="add" size={28} color={atMax ? theme.colors.text.light : theme.colors.primary} />
        </Pressable>
      </View>

      <Text style={styles.hint}>
        {periodType === 'daily' && '3h/day is a healthy starting point for most people.'}
        {periodType === 'weekly' && '21h/week (3h/day) is a balanced starting point.'}
        {periodType === 'monthly' && '90h/month works out to about 3h per day.'}
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
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cream,
    borderRadius: 24,
    padding: 4,
    marginTop: theme.spacing.lg,
    gap: 2,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
  },
  tabLabelActive: {
    color: '#FFFFFF',
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
  stepButtonDisabled: { opacity: 0.4 },
  valueContainer: {
    alignItems: 'center',
    minWidth: 120,
  },
  goalNumber: {
    fontSize: theme.typography.fontSize.display,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.primary,
  },
  goalLabel: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  hint: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
