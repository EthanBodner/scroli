import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

export const WelcomeStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <Mascot size={200} usagePercent={0.2} />

      <Text style={styles.title}>Welcome to Scroly</Text>
      <Text style={styles.subtitle}>Put money on the line.{'\n'}Get your time back.</Text>

      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimer}>No money is taken yet</Text>
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
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.h3 * theme.typography.lineHeight.relaxed,
  },
  disclaimerContainer: {
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
  },
  disclaimer: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
