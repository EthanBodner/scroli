import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { PERIOD_CONFIG } from '../../utils/goalPeriod';

export const CommitmentStep: React.FC = () => {
  const { dailyGoalHours, periodType, stakeAmount } = useOnboardingStore();
  const config = PERIOD_CONFIG[periodType];

  const hoursDisplay = periodType === 'daily' ? dailyGoalHours.toFixed(1) : Math.round(dailyGoalHours).toString();

  // Worst case: 30 days of misses
  const maxRisk = stakeAmount * 30;
  // 7-day streak bonus
  const bonusAmount = stakeAmount;
  // How many bonuses in 30 days
  const bonusCount = Math.floor(30 / 7);
  const totalBonus = bonusAmount * bonusCount;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>You're committing to</Text>

      {/* Goal summary */}
      <View style={styles.goalCard}>
        <Text style={styles.goalHours}>{hoursDisplay}h</Text>
        <Text style={styles.goalUnit}>per {config.unit}</Text>
        <Text style={styles.goalStake}>${stakeAmount} at stake per miss</Text>
      </View>

      {/* Math breakdown */}
      <View style={styles.mathCard}>
        <Text style={styles.mathTitle}>Here's the math</Text>

        <View style={styles.mathRow}>
          <View style={[styles.mathIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="trending-down-outline" size={18} color={theme.colors.error} />
          </View>
          <View style={styles.mathText}>
            <Text style={styles.mathLabel}>Worst case (miss every day for 30 days)</Text>
            <Text style={[styles.mathValue, { color: theme.colors.error }]}>−${maxRisk}</Text>
          </View>
        </View>

        <View style={[styles.mathRow, styles.mathRowBorder]}>
          <View style={[styles.mathIcon, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="trending-up-outline" size={18} color={theme.colors.success} />
          </View>
          <View style={styles.mathText}>
            <Text style={styles.mathLabel}>Best case (hit goal every day)</Text>
            <Text style={[styles.mathValue, { color: theme.colors.success }]}>$0 lost</Text>
          </View>
        </View>

        <View style={[styles.mathRow, styles.mathRowBorder]}>
          <View style={[styles.mathIcon, { backgroundColor: theme.colors.primaryFaded }]}>
            <Ionicons name="flame-outline" size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.mathText}>
            <Text style={styles.mathLabel}>7-day streak bonus (×{bonusCount} in 30 days)</Text>
            <Text style={[styles.mathValue, { color: theme.colors.primary }]}>+${totalBonus} earned back</Text>
          </View>
        </View>
      </View>

      {/* Streak bonus explainer */}
      <View style={styles.bonusCard}>
        <Text style={styles.bonusTitle}>🔥 Streak Bonus</Text>
        <Text style={styles.bonusBody}>
          Hit your goal 7 days in a row and earn ${bonusAmount} back into your wallet. Keep going and earn it again every 7 days.
        </Text>
      </View>

      <Text style={styles.footer}>
        No money moves until your payment method is set up.{'\n'}You can change your goal or stake any time.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  goalCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  goalHours: {
    fontSize: 56,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    lineHeight: 64,
  },
  goalUnit: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.sm,
  },
  goalStake: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mathCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  mathTitle: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  mathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  mathRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  mathIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mathText: { flex: 1 },
  mathLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  mathValue: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.bold,
  },
  bonusCard: {
    backgroundColor: theme.colors.primaryFaded,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  bonusTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
    marginBottom: 6,
  },
  bonusBody: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.small * theme.typography.lineHeight.relaxed,
  },
  footer: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.small * theme.typography.lineHeight.relaxed,
  },
});
