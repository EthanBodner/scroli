import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

export const ResetStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <Mascot size={180} usagePercent={0.1} />

      <Text style={styles.title}>Tomorrow is a{'\n'}new day</Text>
      <Text style={styles.message}>
        Every day resets at midnight. Come back stronger.
      </Text>

      <View style={styles.tipsCard}>
        {[
          'Put your phone in another room at night',
          'Turn on Screen Time limits for your top apps',
          'Replace scroll time with a 5-min walk',
        ].map((tip, i) => (
          <View key={i} style={[styles.tipRow, i > 0 && styles.tipRowBorder]}>
            <View style={styles.tipIcon}>
              <Ionicons name="checkmark" size={14} color={theme.colors.primary} />
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
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
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.h1 * theme.typography.lineHeight.tight,
  },
  message: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  tipsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    ...theme.shadows.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  tipRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.fontSize.small * theme.typography.lineHeight.relaxed,
  },
});
