import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Mascot } from '../../components/mascots/Mascot';
import { WalletMascot } from '../../components/mascots/WalletMascot';
import { PiggyMascot } from '../../components/mascots/PiggyMascot';
import { CoinStackMascot } from '../../components/mascots/CoinStackMascot';
import { WeekCalendar } from '../../components/WeekCalendar';
import { TopOffendersCard } from './TopOffendersCard';
import { useUiStore } from '../../stores/uiStore';
import { formatTime } from '../../utils/formatters';
import { MAX_DAILY_HOURS } from '../../utils/constants';
import { useScreenTime } from '../../hooks/useScreenTime';

const MOCK = {
  atStake: 5,
  currentStreak: 6,
  weekHistory: ['check', 'check', 'miss', 'check', 'check', 'check', 'future'] as Array<'check' | 'miss' | 'future'>,
  topOffenders: [
    { name: 'Instagram', icon: 'logo-instagram' as const, color: '#E4405F', time: '1h 12m' },
    { name: 'TikTok', icon: 'musical-notes' as const, color: '#000000', time: '45m' },
    { name: 'Twitter', icon: 'logo-twitter' as const, color: '#1DA1F2', time: '23m' },
  ],
};

export const DashboardScreen: React.FC = () => {
  const { currentMascot } = useUiStore();
  const { hoursToday, permissionGranted, loading } = useScreenTime();

  // Fall back to 0 while loading or if permission denied
  const currentHours = permissionGranted ? hoursToday : 0;
  const usagePercent = Math.min(currentHours / MAX_DAILY_HOURS, 1);

  const renderMascot = () => {
    const props = { size: 240, usagePercent };
    switch (currentMascot) {
      case 'wallet':
        return <WalletMascot {...props} />;
      case 'piggy':
        return <PiggyMascot {...props} />;
      case 'coinstack':
        return <CoinStackMascot {...props} />;
      default:
        return <Mascot {...props} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scroly</Text>
          <Pressable>
            <Ionicons name="help-circle-outline" size={28} color={theme.colors.text.primary} />
          </Pressable>
        </View>

        {/* Mascot */}
        <View style={styles.mascotContainer}>{renderMascot()}</View>

        {/* Current Hours */}
        <Text style={styles.displayNumber}>
          {loading ? '…' : currentHours.toFixed(1)}
        </Text>
        <Text style={styles.hoursLabel}>hours today</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <ProgressBar progress={usagePercent} height={12} />
        </View>

        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>0</Text>
          <Text style={styles.progressLabel}>{MAX_DAILY_HOURS}h goal</Text>
        </View>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Screen Time Today</Text>
              <Text style={styles.statusValue}>{formatTime(currentHours * 60)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>At Stake</Text>
              <Text style={[styles.statusValue, styles.statusValueStake]}>
                ${MOCK.atStake}
              </Text>
            </View>
          </View>
        </Card>

        {/* Streak Section */}
        <View style={styles.streakSection}>
          <Text style={styles.sectionTitle}>Current Streak</Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmojis}>🔥🔥🔥</Text>
            <Text style={styles.streakText}>{MOCK.currentStreak} days</Text>
          </View>
        </View>

        {/* Week Calendar */}
        <View style={styles.weekSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <WeekCalendar weekHistory={MOCK.weekHistory} />
        </View>

        {/* Top Offenders */}
        <TopOffendersCard offenders={MOCK.topOffenders} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  mascotContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  displayNumber: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  hoursLabel: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  progressBarContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  statusCard: {
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  statusLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statusValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  statusValueStake: {
    color: theme.colors.primary,
  },
  streakSection: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  streakEmojis: {
    fontSize: theme.typography.fontSize.h1,
  },
  streakText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  weekSection: {
    marginBottom: theme.spacing.md,
  },
});
