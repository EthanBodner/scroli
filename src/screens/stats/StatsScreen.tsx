import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { LoadingView } from '../../components/ui/LoadingView';
import { theme } from '../../theme';
import { formatPercentage } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingService } from '../../services/TrackingService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const StatsScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [wins, setWins] = useState(0);
  const [misses, setMisses] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [moneyDonated, setMoneyDonated] = useState(0);
  const [goalHours, setGoalHours] = useState(3);
  const [dailyUsage, setDailyUsage] = useState<{ day: string; hours: number; goal: number }[]>([]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      try {
        const [records, transactions, goal] = await Promise.all([
          TrackingService.getRecentRecords(user.id, 7),
          TrackingService.getTransactions(user.id),
          TrackingService.getActiveGoal(user.id),
        ]);

        const goalMins = goal?.daily_limit_minutes ?? 180;
        setGoalHours(goalMins / 60);

        const w = records.filter(r => r.status === 'success').length;
        const m = records.filter(r => r.status === 'failure').length;
        setWins(w);
        setMisses(m);

        const saved = transactions
          .filter(t => t.type === 'refund')
          .reduce((sum, t) => sum + t.amount_cents, 0);
        const donated = transactions
          .filter(t => t.type === 'donation')
          .reduce((sum, t) => sum + t.amount_cents, 0);
        setMoneySaved(Math.round(saved / 100));
        setMoneyDonated(Math.round(donated / 100));

        const usage = records.map(r => ({
          day: DAYS[new Date(r.date).getDay()],
          hours: r.duration_minutes / 60,
          goal: goalMins / 60,
        }));
        setDailyUsage(usage);
      } catch (err) {
        console.error('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) return <LoadingView />;

  const total = wins + misses;
  const winRate = total > 0 ? wins / total : 0;
  const maxHours = Math.max(goalHours * 1.5, ...dailyUsage.map(d => d.hours), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Stats</Text>

        {/* Win Rate Card */}
        <Card style={styles.card}>
          <View style={styles.winRateHeader}>
            <Text style={styles.trophy}>🏆</Text>
            <View>
              <Text style={styles.winRateLabel}>Win Rate</Text>
              <Text style={styles.winRateValue}>{formatPercentage(winRate)}</Text>
            </View>
          </View>
          <View style={styles.winRateBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownValue}>{wins}</Text>
              <Text style={styles.breakdownLabel}>Wins</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownValue, styles.missesValue]}>{misses}</Text>
              <Text style={styles.breakdownLabel}>Misses</Text>
            </View>
          </View>
        </Card>

        {/* Money Cards */}
        <View style={styles.moneyRow}>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyLabel}>Money Saved</Text>
            <Text style={[styles.moneyValue, styles.moneySaved]}>${moneySaved}</Text>
          </Card>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyLabel}>Money Donated</Text>
            <Text style={[styles.moneyValue, styles.moneyDonated]}>${moneyDonated}</Text>
          </Card>
        </View>

        {/* Weekly Usage Chart */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>This Week's Usage</Text>
          {dailyUsage.length === 0 ? (
            <Text style={styles.emptyText}>No data yet — keep tracking!</Text>
          ) : (
            <View style={styles.chart}>
              {dailyUsage.map((day, index) => {
                const heightPercent = (day.hours / maxHours) * 100;
                const isOverGoal = day.hours > day.goal;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: isOverGoal ? theme.colors.error : theme.colors.success,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{day.day}</Text>
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

        {/* Impact Card */}
        {moneyDonated > 0 && (
          <Card style={styles.impactCard}>
            <Text style={styles.impactTitle}>Real World Impact</Text>
            <Text style={styles.impactMessage}>
              ${moneyDonated} protected {Math.max(1, moneyDonated * 2)} children from malaria for a month
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
  header: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  card: { marginBottom: theme.spacing.md },
  winRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trophy: { fontSize: 48 },
  winRateLabel: { fontSize: theme.typography.fontSize.body, color: theme.colors.text.secondary },
  winRateValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  winRateBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  breakdownItem: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: theme.colors.border },
  breakdownValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  missesValue: { color: theme.colors.error },
  breakdownLabel: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary },
  moneyRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  moneyCard: { flex: 1, alignItems: 'center' },
  moneyLabel: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs },
  moneyValue: { fontSize: theme.typography.fontSize.h1, fontWeight: theme.typography.fontWeight.bold },
  moneySaved: { color: theme.colors.success },
  moneyDonated: { color: theme.colors.primary },
  cardTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: theme.spacing.sm,
  },
  chartBar: { flex: 1, alignItems: 'center', height: '100%' },
  barContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '70%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: theme.typography.fontSize.tiny, color: theme.colors.text.secondary, marginTop: theme.spacing.xs },
  goalLine: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  goalLineDash: { flex: 1, height: 2, backgroundColor: theme.colors.border },
  goalLineLabel: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary },
  impactCard: { backgroundColor: theme.colors.cream },
  impactTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  impactMessage: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  emptyText: { fontSize: theme.typography.fontSize.body, color: theme.colors.text.secondary, textAlign: 'center', paddingVertical: theme.spacing.md },
});
