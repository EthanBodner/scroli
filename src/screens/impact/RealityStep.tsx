import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface RealityStepProps {
  goalHours: number;
  actualHours: number;
}

export const RealityStep: React.FC<RealityStepProps> = ({ goalHours, actualHours }) => {
  return (
    <View style={styles.container}>
      <View style={{ width: 200, height: 200, backgroundColor: '#FCA5A5', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 80 }}>😢</Text>
      </View>

      <Text style={styles.title}>Here's the reality...</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Your Goal</Text>
          <Text style={styles.statValue}>{goalHours.toFixed(1)}h</Text>
        </View>

        <Text style={styles.vsText}>vs</Text>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>You Used</Text>
          <Text style={[styles.statValue, styles.statValueOver]}>
            {actualHours.toFixed(1)}h
          </Text>
        </View>
      </View>

      <Text style={styles.message}>
        You went over by {(actualHours - goalHours).toFixed(1)} hours
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
    backgroundColor: '#FEE2E2',
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  statBox: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 120,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statValueOver: {
    color: theme.colors.error,
  },
  vsText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  message: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
});
