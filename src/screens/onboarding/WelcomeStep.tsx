import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { ScroliLogo, WaveIcon } from '../../components/ScroliLogo';

export const WelcomeStep: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Large icon */}
      <View style={styles.iconWrapper}>
        <ScroliLogo variant="icon" size="lg" />
      </View>

      {/* Full wordmark */}
      <ScroliLogo variant="full" size="lg" />

      <Text style={styles.subtitle}>
        Put money on the line.{'\n'}Get your time back.
      </Text>

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
  iconWrapper: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
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
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
