import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

export const ResetStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <Mascot size={200} usagePercent={0.1} />

      <Text style={styles.title}>Tomorrow is a new day</Text>

      <Text style={styles.message}>
        Every day is a fresh start. Your counter resets at midnight, and you get another chance to stay under your goal.
      </Text>

      <View style={styles.encouragementCard}>
        <Text style={styles.encouragementText}>
          💪 You've got this! Learn from today and come back stronger tomorrow.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  encouragementCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  encouragementText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
