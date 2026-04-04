import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';
import { STAKE_OPTIONS } from '../../utils/constants';
import { useOnboardingStore } from '../../stores/onboardingStore';

export const StakeStep: React.FC = () => {
  const { stakeAmount, setStakeAmount: setSelectedStake } = useOnboardingStore();
  const selectedStake = stakeAmount;

  return (
    <View style={styles.container}>
      <Mascot size={200} usagePercent={0.1} />

      <Text style={styles.title}>Choose Your Daily Stake</Text>
      <Text style={styles.subtitle}>
        If you go over your goal, this amount goes to charity
      </Text>

      <View style={styles.stakeOptions}>
        {STAKE_OPTIONS.map((amount) => (
          <Pressable
            key={amount}
            style={[
              styles.stakeOption,
              selectedStake === amount && styles.stakeOptionSelected,
            ]}
            onPress={() => setSelectedStake(amount)}
          >
            <Text
              style={[
                styles.stakeAmount,
                selectedStake === amount && styles.stakeAmountSelected,
              ]}
            >
              ${amount}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.description}>
        Higher stakes = higher motivation.{'\n'}
        You can change this later.
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
  stakeOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  stakeOption: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stakeOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  stakeAmount: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  stakeAmountSelected: {
    color: theme.colors.text.white,
  },
  description: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
