import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { TrackingService } from '../../services/TrackingService';
import { showAlert } from '../../utils/alert';

const MIN_HOURS = 0.5;
const MAX_HOURS = 8;
const STEP = 0.5;

export const GoalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { dailyGoalHours, setDailyGoalHours } = useOnboardingStore();
  const [hours, setHours] = useState(dailyGoalHours);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHours(dailyGoalHours);
  }, [dailyGoalHours]);

  const decrement = () => setHours((h) => Math.max(MIN_HOURS, Math.round((h - STEP) * 10) / 10));
  const increment = () => setHours((h) => Math.min(MAX_HOURS, Math.round((h + STEP) * 10) / 10));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await TrackingService.saveGoal(user.id, Math.round(hours * 60));
      setDailyGoalHours(hours);
      navigation.goBack();
    } catch {
      showAlert('Error', 'Could not save your goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Daily Goal</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>How many hours of screen time is your daily limit?</Text>

        <View style={styles.pickerRow}>
          <Pressable
            style={[styles.stepButton, hours <= MIN_HOURS && styles.stepButtonDisabled]}
            onPress={decrement}
            disabled={hours <= MIN_HOURS}
          >
            <Ionicons name="remove" size={28} color={hours <= MIN_HOURS ? theme.colors.text.light : theme.colors.primary} />
          </Pressable>

          <View style={styles.valueContainer}>
            <Text style={styles.value}>{hours.toFixed(1)}</Text>
            <Text style={styles.valueLabel}>hours / day</Text>
          </View>

          <Pressable
            style={[styles.stepButton, hours >= MAX_HOURS && styles.stepButtonDisabled]}
            onPress={increment}
            disabled={hours >= MAX_HOURS}
          >
            <Ionicons name="add" size={28} color={hours >= MAX_HOURS ? theme.colors.text.light : theme.colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.hint}>3.0 hours is a great starting point for most people.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.colors.text.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Goal</Text>
          )}
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
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 120,
  },
  value: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  valueLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.white,
  },
});
