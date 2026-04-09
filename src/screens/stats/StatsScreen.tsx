import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { LoadingView } from '../../components/ui/LoadingView';
import { CircularProgress } from '../../components/CircularProgress';
import { ConsistencyCalendar } from '../../components/ConsistencyCalendar';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingService } from '../../services/TrackingService';

type Period = 'week' | 'month' | 'all';

const PERIOD_LABELS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'all', label: 'All Time' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function filterByPeriod(records: { date: string; status: string; duration_minutes: number }[], period: Period) {
  const now = new Date();
  if (period === 'all') return records;
  return records.filter((r) => {
    const d = new Date(r.date);
    if (period === 'week') {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 7);
      return d >= cutoff;
    }
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export const StatsScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('week');
  const [allRecords, setAllRecords] = useState<{ date: string; status: string; duration_minutes: number }[]>([]);
  const [moneySaved, setMoneySaved] = useState(0);
  const [moneyDonated, setMoneyDonated] = useState(0);
  const [goalHours, setGoalHours] = useState(3);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const [records, transactions, goal] = await Promise.all([
          TrackingService.getRecentRecords(user.id, 90),
          TrackingService.getTransactions(user.id),
          TrackingService.getActiveGoal(user.id),
        ]);
        setGoalHours((goal?.daily_limit_minutes ?? 180) / 60);
        setAllRecords(records);
        setMoneySaved(Math.round(transactions.filter(t => t.type === 'refund').reduce((s, t) => s + t.amount_cents, 0) / 100));
        setMoneyDonated(Math.round(transactions.filter(t => t.type === 'donation').reduce((s, t) => s + t.amount_cents, 0) / 100));
      } catch (err) {
        console.error('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <LoadingView />;

  const filtered = filterByPeriod(allRecords, period);
  const wins = filtered.filter(r => r.status === 'success').length;
  const misses = filtered.filter(r => r.status === 'failure').length;
  const total = wins + misses;
  const winRate = total > 0 ? wins / total : 0;

  const chartRecords = allRecords.slice(-7);
  const maxHours = Math.max(goalHours * 1.5, ...chartRecords.map(r => r.duration_minutes / 60), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Stats</Text>
          <View style={styles.periodToggle}>
            {PERIOD_LABELS.map(({ key, label }) => (
              <Pressable
                key={key}
                style={[styles.periodTab, period === key && styles.periodTabActive]}
                onPress={() => setPeriod(key)}
              >
                <Text style={[styles.periodLabel, period === key && styles.periodLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Win Rate Hero */}
        <Card style={styles.winCard}>
          <Text style={styles.cardTitle}>Win Rate</Text>
          <View style={styles.winRateContent}>
            <CircularProgress
              progress={winRate}
              size={156}
              strokeWidth={14}
              color={winRate >= 0.7 ? theme.colors.success : winRate >= 0.4 ? theme.colors.warning : theme.colors.error}
              label={`${Math.round(winRate * 100)}%`}
              sublabel={`${total} days`}
            />
            <View style={styles.winStats}>
              <View style={[styles.pill, styles.pillWin]}>
                <Text style={[styles.pillCount, { color: theme.colors.success }]}>{wins}</Text>
                <Text style={styles.pillLabel}>wins</Text>
              </View>
              <View style={[styles.pill, styles.pillMiss]}>
                <Text style={[styles.pillCount, { color: theme.colors.error }]}>{misses}</Text>
                <Text style={styles.pillLabel}>misses</Text>
              </View>
              {total === 0 && (
                <Text style={styles.emptyNote}>No data yet</Text>
              )}
            </View>
          </View>
        </Card>

        {/* Money Row */}
        <View style={styles.moneyRow}>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyEmoji}>💰</Text>
            <Text style={[styles.moneyValue, { color: theme.colors.success }]}>${moneySaved}</Text>
            <Text style={styles.moneyLabel}>earned back</Text>
          </Card>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyEmoji}>❤️</Text>
            <Text style={[styles.moneyValue, { color: theme.colors.primary }]}>${moneyDonated}</Text>
            <Text style={styles.moneyLabel}>donated</Text>
          </Card>
        </View>

        {/* Consistency Calendar */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Consistency</Text>
          <ConsistencyCalendar records={allRecords} days={35} />
        </Card>

        {/* Usage Chart */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Last 7 Days</Text>
          {chartRecords.length === 0 ? (
            <Text style={styles.emptyText}>No data yet — keep tracking!</Text>
          ) : (
            <View style={styles.chart}>
              {chartRecords.map((r, i) => {
                const hours = r.duration_minutes / 60;
                const heightPercent = (hours / maxHours) * 100;
                const over = hours > goalHours;
                return (
                  <View key={i} style={styles.chartBar}>
                    <Text style={styles.barValue}>{hours.toFixed(1)}</Text>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { height: `${heightPercent}%`, backgroundColor: over ? theme.colors.error : theme.colors.success }]} />
                    </View>
                    <Text style={styles.barLabel}>{DAYS[new Date(r.date).getDay()]}</Text>
                  </View>
                );
              })}
            </View>
          )}
          <View style={styles.goalLine}>
            <View style={styles.goalLineDash} />
            <Text style={styles.goalLineLabel}>{goalHours}h goal</Text>
          </View>
        </Card>

        {/* Impact */}
        {moneyDonated > 0 && (
          <Card style={styles.impactCard}>
            <Text style={styles.impactTitle}>Real World Impact 🌍</Text>
            <Text style={styles.impactMessage}>
              Your ${moneyDonated} protected {Math.max(1, moneyDonated * 2)} children from malaria for a month
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.xl },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  header: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cream,
    borderRadius: 20,
    padding: 3,
  },
  periodTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 17,
  },
  periodTabActive: {
    backgroundColor: theme.colors.primary,
  },
  periodLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
  },
  periodLabelActive: {
    color: '#FFFFFF',
  },

  card: { marginBottom: theme.spacing.md },
  cardTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  winCard: { marginBottom: theme.spacing.md },
  winRateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  winStats: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  pillWin: { backgroundColor: '#DCFCE7' },
  pillMiss: { backgroundColor: '#FEE2E2' },
  pillCount: {
    fontSize: theme.typography.fontSize.h2,
    fontFamily: theme.typography.fontFamily.bold,
  },
  pillLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  emptyNote: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
    textAlign: 'center',
  },

  moneyRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  moneyCard: { flex: 1, alignItems: 'center', gap: 4 },
  moneyEmoji: { fontSize: 26 },
  moneyValue: {
    fontSize: theme.typography.fontSize.h2,
    fontFamily: theme.typography.fontFamily.extrabold,
  },
  moneyLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: theme.spacing.sm,
  },
  chartBar: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '65%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barValue: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  barLabel: {
    fontSize: theme.typography.fontSize.tiny,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  goalLine: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  goalLineDash: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.border },
  goalLineLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  impactCard: { backgroundColor: theme.colors.primaryFaded, marginBottom: theme.spacing.md },
  impactTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  impactMessage: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
  },
});
