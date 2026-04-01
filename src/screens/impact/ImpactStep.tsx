import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface ImpactStepProps {
  donationAmount: number;
  impactMessage: string;
}

export const ImpactStep: React.FC<ImpactStepProps> = ({ donationAmount, impactMessage }) => {

  return (
    <LinearGradient
      colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
      style={styles.container}
    >
      <Text style={styles.heartIcon}>❤️</Text>

      <Text style={styles.title}>Your ${donationAmount} is going to charity</Text>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Real World Impact</Text>
        <Text style={styles.impactMessage}>{impactMessage}</Text>
      </View>

      <Text style={styles.subtitle}>
        While you lost today, someone else won because of you.
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  heartIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  impactCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  impactTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  impactMessage: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
