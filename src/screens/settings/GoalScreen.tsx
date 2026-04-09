import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboardingStore, PeriodType } from '../../stores/onboardingStore';
import { TrackingService } from '../../services/TrackingService';
import { showAlert } from '../../utils/alert';
import { PERIOD_CONFIG, PERIOD_TYPES } from '../../utils/goalPeriod';

export const GoalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { dailyGoalHours, setDailyGoalHours, periodType, setPeriodType } = useOnboardingStore();

  const [hours, setHours] = useState(dailyGoalHours);
  const [period, setPeriod] = useState<PeriodType>(periodType);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHours(dailyGoalHours);
    setPeriod(periodType);
  }, [dailyGoalHours, periodType]);

  const config = PERIOD_CONFIG[period];
  const atMin = hours <= config.min;
  const atMax = hours >= config.max;

  const handlePeriodChange = (p: PeriodType) => {
    setPeriod(p);
    setHours(PERIOD_CONFIG[p].defaultHours);
  };

  const decrement = () => setHours((h) => Math.max(config.min, Math.round((h - config.step) * 10) / 10));
  const increment = () => setHours((h) => Math.min(config.max, Math.round((h + config.step) * 10) / 10));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await TrackingService.saveGoal(user.id, Math.round(hours * 60), period);
      setDailyGoalHours(hours);
      setPeriodType(period);
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
        <Text style={styles.headerTitle}>Screen Time Goal</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>How much screen time are you allowed?</Text>

        {/* Period tabs */}
        <View style={styles.tabs}>
          {PERIOD_TYPES.map((p) => (
            <Pressable
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => handlePeriodChange(p)}
            >
              <Text style={[styles.tabLabel, period === p && styles.tabLabelActive]}>
                {PERIOD_CONFIG[p].label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Picker */}
        <View style={styles.pickerRow}>
          <Pressable style={[styles.stepButton, atMin && styles.stepButtonDisabled]} onPress={decrement} disabled={atMin}>
            <Ionicons name="remove" size={28} color={atMin ? theme.colors.text.light : theme.colors.primary} />
          </Pressable>

          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {period === 'daily' ? hours.toFixed(1) : Math.round(hours)}
            </Text>
            <Text style={styles.valueLabel}>hours / {config.unit}</Text>
          </View>

          <Pressable style={[styles.stepButton, atMax && styles.stepButtonDisabled]} onPress={increment} disabled={atMax}>
            <Ionicons name="add" size={28} color={atMax ? theme.colors.text.light : theme.colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.hint}>
          {period === 'daily' && '3h/day is a healthy starting point for most people.'}
          {period === 'weekly' && '21h/week (3h/day) is a balanced starting point.'}
          {period === 'monthly' && '90h/month works out to about 3h per day.'}
        </Text>
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: { width: 40 },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.semibold,
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
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cream,
    borderRadius: 24,
    padding: 4,
    gap: 2,
    marginBottom: theme.spacing.xl,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
  },
  tabLabelActive: { color: '#FFFFFF' },
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
  stepButtonDisabled: { opacity: 0.4 },
  valueContainer: { alignItems: 'center', minWidth: 120 },
  value: {
    fontSize: theme.typography.fontSize.display,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.primary,
  },
  valueLabel: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  hint: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
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
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.white,
  },
});
