import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { STAKE_OPTIONS } from '../../utils/constants';

export const StakeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { stakeAmount, setStakeAmount } = useOnboardingStore();
  const [selected, setSelected] = useState(stakeAmount);

  const handleSave = () => {
    setStakeAmount(selected);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Daily Stake</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          If you go over your screen time goal, this amount goes to charity.
        </Text>

        <View style={styles.options}>
          {STAKE_OPTIONS.map((amount) => (
            <Pressable
              key={amount}
              style={[styles.option, selected === amount && styles.optionSelected]}
              onPress={() => setSelected(amount)}
            >
              <Text style={[styles.optionAmount, selected === amount && styles.optionAmountSelected]}>
                ${amount}
              </Text>
              <Text style={[styles.optionLabel, selected === amount && styles.optionLabelSelected]}>
                per day
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.hint}>Higher stakes = higher motivation. You can change this any time.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Stake</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  options: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  option: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  optionAmount: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  optionAmountSelected: {
    color: theme.colors.text.white,
  },
  optionLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  optionLabelSelected: {
    color: theme.colors.text.white,
  },
  hint: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.white,
  },
});
