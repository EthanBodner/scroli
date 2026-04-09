import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

interface RealityStepProps {
  goalHours: number;
  actualHours: number;
}

export const RealityStep: React.FC<RealityStepProps> = ({ goalHours, actualHours }) => {
  const overBy = (actualHours - goalHours).toFixed(1);

  return (
    <View style={styles.container}>
      <Mascot size={180} usagePercent={1} />

      <Text style={styles.title}>Here's the reality</Text>
      <Text style={styles.subtitle}>You went over by {overBy} hours today</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Your goal</Text>
          <Text style={styles.statValue}>{goalHours.toFixed(1)}h</Text>
        </View>
        <View style={styles.vsWrap}>
          <Text style={styles.vsText}>vs</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxOver]}>
          <Text style={styles.statLabel}>You used</Text>
          <Text style={[styles.statValue, styles.statValueOver]}>{actualHours.toFixed(1)}h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: '#FEF2F2',
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statBoxOver: {
    backgroundColor: '#FEE2E2',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  statValueOver: {
    color: theme.colors.error,
  },
  vsWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
  },
});
