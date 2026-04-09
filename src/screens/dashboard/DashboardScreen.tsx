import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Card } from '../../components/ui/Card';
import { Mascot } from '../../components/mascots/Mascot';
import { WalletMascot } from '../../components/mascots/WalletMascot';
import { PiggyMascot } from '../../components/mascots/PiggyMascot';
import { CoinStackMascot } from '../../components/mascots/CoinStackMascot';
import { WeekCalendar } from '../../components/WeekCalendar';
import { CircularProgress } from '../../components/CircularProgress';
import { TopOffendersCard } from './TopOffendersCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuth } from '../../contexts/AuthContext';
import { ScroliLogo } from '../../components/ScroliLogo';
import { formatTime } from '../../utils/formatters';
import { MascotType } from '../../utils/constants';
import { useScreenTime } from '../../hooks/useScreenTime';
import { TrackingService } from '../../services/TrackingService';
import { getMascotForCharity } from '../../utils/charityMascots';
import { getPeriodLabel } from '../../utils/goalPeriod';
import { supabase } from '../../services/supabase';

type DayStatus = 'check' | 'miss' | 'future';

const MOCK_OFFENDERS = [
  { name: 'Instagram', icon: 'logo-instagram' as const, color: '#E4405F', time: '1h 12m' },
  { name: 'TikTok',   icon: 'musical-note'   as const, color: '#010101', time: '45m' },
  { name: 'Twitter',  icon: 'logo-twitter'   as const, color: '#1DA1F2', time: '23m' },
];

function getMondayOfWeek(today: Date): Date {
  const d = new Date(today);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(today: Date): string[] {
  const monday = getMondayOfWeek(today);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function computeStreak(records: { date: string; status: string }[], today: string): number {
  const successSet = new Set(
    records.filter((r) => r.status === 'success').map((r) => r.date),
  );
  let streak = 0;
  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (successSet.has(dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export const DashboardScreen: React.FC = () => {
  const { stakeAmount } = useOnboardingStore();
  const { user } = useAuth();
  const { hoursToday, minutesToday, permissionGranted, loading } = useScreenTime();

  const [weekHistory, setWeekHistory] = useState<DayStatus[]>(Array(7).fill('future'));
  const [streak, setStreak] = useState(0);
  const [activeMascot, setActiveMascot] = useState<MascotType>('original');
  const [charityName, setCharityName] = useState<string | null>(null);
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [periodLimitMinutes, setPeriodLimitMinutes] = useState(180);
  const [periodUsageMinutes, setPeriodUsageMinutes] = useState(0);

  const currentHours = permissionGranted ? hoursToday : 0;
  const periodLimitHours = periodLimitMinutes / 60;
  const periodUsageHours = periodUsageMinutes / 60;
  const usagePercent = Math.min(periodUsageHours / periodLimitHours, 1);
  const periodLabel = getPeriodLabel(periodType);
  const streakToBonus = 7 - (streak % 7);

  const fetchWeekData = useCallback(async () => {
    if (!user) return;
    try {
      const [records, profileRes, goal] = await Promise.all([
        TrackingService.getRecentRecords(user.id, 35),
        supabase.from('profiles').select('charities(name)').eq('id', user.id).single(),
        TrackingService.getActiveGoal(user.id),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const weekDates = getWeekDates(new Date());
      const recordMap = new Map(records.map((r) => [r.date, r.status]));
      const durationMap = new Map(records.map((r) => [r.date, r.duration_minutes]));

      const history: DayStatus[] = weekDates.map((date) => {
        if (date >= today) return 'future';
        const status = recordMap.get(date);
        return status === 'success' ? 'check' : status === 'failure' ? 'miss' : 'future';
      });

      setWeekHistory(history);
      setStreak(computeStreak(records, today));

      const resolvedCharityName = (profileRes.data?.charities as any)?.name ?? null;
      setCharityName(resolvedCharityName);
      setActiveMascot(getMascotForCharity(resolvedCharityName));

      const pt = (goal?.period_type ?? 'daily') as 'daily' | 'weekly' | 'monthly';
      setPeriodType(pt);
      setPeriodLimitMinutes(goal?.daily_limit_minutes ?? 180);

      if (pt === 'weekly') {
        const weekTotal = weekDates.reduce((sum, d) => sum + (durationMap.get(d) ?? 0), 0);
        setPeriodUsageMinutes(weekTotal);
      } else if (pt === 'monthly') {
        const now = new Date();
        let monthTotal = 0;
        records.forEach((r) => {
          const d = new Date(r.date);
          if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            monthTotal += r.duration_minutes;
          }
        });
        setPeriodUsageMinutes(monthTotal);
      } else {
        setPeriodUsageMinutes(minutesToday);
      }
    } catch (err) {
      console.error('Failed to fetch week data:', err);
    }
  }, [user, minutesToday]);

  useEffect(() => {
    if (user && permissionGranted && minutesToday > 0) {
      TrackingService.saveDailyRecord(user.id, minutesToday).catch(console.error);
    }
    fetchWeekData();
  }, [user, permissionGranted, minutesToday, fetchWeekData]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchWeekData();
    });
    return () => sub.remove();
  }, [fetchWeekData]);

  const renderMascot = () => {
    const props = { size: 180, usagePercent };
    switch (activeMascot) {
      case 'wallet': return <WalletMascot {...props} />;
      case 'piggy': return <PiggyMascot {...props} />;
      case 'coinstack': return <CoinStackMascot {...props} />;
      default: return <Mascot {...props} />;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ScroliLogo variant="full" size="sm" color={theme.colors.primary} />
            <View style={styles.headerRight}>
              <Pressable style={[styles.iconButton, styles.headerIcon]}>
                <Ionicons name="help-circle" size={24} color={theme.colors.text.secondary} />
              </Pressable>
              <Pressable style={[styles.iconButton, styles.headerIcon]}>
                <Ionicons name="notifications" size={24} color={theme.colors.text.secondary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.heroContainer}>
            <View style={styles.mascotStage}>
              <View style={styles.mascotUnderlay}>
                {renderMascot()}
              </View>
              {charityName && (
                <View style={styles.heroCharityPill}>
                  <Ionicons name="heart" size={10} color={theme.colors.primary} />
                  <Text style={styles.heroCharityText}>{charityName}</Text>
                </View>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.timeCircle}>
                <CircularProgress
                  progress={usagePercent}
                  size={120}
                  strokeWidth={14}
                  color={usagePercent > 0.9 ? theme.colors.error : theme.colors.success}
                  label={loading ? '…' : (periodType === 'daily' ? `${currentHours.toFixed(1)}` : `${periodUsageHours.toFixed(1)}`)}
                  sublabel="hours"
                />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>{periodLabel} Limit</Text>
                <Text style={styles.goalValue}>{periodLimitHours}h</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricRow}>
            <Card style={[styles.metricChip, { backgroundColor: '#FFFFFF' }]}>
              <View style={[styles.chipIcon, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
                <Ionicons name="time" size={18} color="#7C3AED" />
              </View>
              <View>
                <Text style={styles.chipValue}>{formatTime(currentHours * 60)}</Text>
                <Text style={styles.chipLabel}>Used Today</Text>
              </View>
            </Card>

            <Card style={[styles.metricChip, { backgroundColor: '#FFFFFF' }]}>
              <View style={[styles.chipIcon, { backgroundColor: 'rgba(232, 112, 106, 0.1)' }]}>
                <Ionicons name="shield-checkmark" size={18} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.chipValue, { color: theme.colors.primary }]}>${stakeAmount}</Text>
                <Text style={styles.chipLabel}>At Stake</Text>
              </View>
            </Card>
          </View>

          <Card style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakInfo}>
                <View style={styles.streakFireCircle}>
                  <Ionicons name="flame" size={24} color="#F97316" />
                </View>
                <View>
                  <Text style={styles.streakTitle}>{streak} Day Streak</Text>
                  <Text style={styles.streakSubtitle}>
                    {streakToBonus} more day{streakToBonus === 1 ? '' : 's'} to earn bonus
                  </Text>
                </View>
              </View>
              <View style={styles.streakValueBadge}>
                <Text style={styles.streakValueText}>+{streak % 7}/7</Text>
              </View>
            </View>
            
            <View style={styles.streakDotsLayout}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.streakDot,
                    i < (streak % 7) && styles.streakDotActive,
                    i === (streak % 7) && styles.streakDotNext
                  ]}
                />
              ))}
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>Your Consistency</Text>
          </View>
          <Card style={styles.weekCard}>
            <WeekCalendar weekHistory={weekHistory} />
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>Screen Time Breakdown</Text>
          </View>
          <TopOffendersCard offenders={MOCK_OFFENDERS} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 12,
  },
  mascotStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mascotUnderlay: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryFaded,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...theme.shadows.md,
  },
  heroCharityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -20,
    gap: 4,
    ...theme.shadows.sm,
    borderWidth: 2,
    borderColor: theme.colors.primaryFaded,
  },
  heroCharityText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 32,
    gap: 20,
    ...theme.shadows.md,
    borderWidth: 2,
    borderColor: theme.colors.cream,
    width: '100%',
  },
  timeCircle: {
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipValue: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  chipLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 28,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakFireCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  streakSubtitle: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.light,
  },
  streakValueBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streakValueText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#F97316',
  },
  streakDotsLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  streakDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  streakDotActive: {
    backgroundColor: '#F97316',
  },
  streakDotNext: {
    backgroundColor: '#FED7AA',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitleText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 24,
  },
});
