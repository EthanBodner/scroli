import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
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

  const winColor = winRate >= 0.7 ? theme.colors.success : winRate >= 0.4 ? theme.colors.warning : theme.colors.error;
  const winBg = winRate >= 0.7 ? '#F0FDF4' : winRate >= 0.4 ? '#FFFBEB' : '#FFF1F2';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Stats</Text>
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

        {/* ── Summary Sticker Chips ── */}
        <View style={styles.summaryGrid}>
          <Card style={[styles.summaryChip, { backgroundColor: theme.colors.tealFaded }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(114, 192, 152, 0.1)' }]}>
              <Ionicons name="cash" size={18} color={theme.colors.teal} />
            </View>
            <Text style={[styles.chipValue, { color: theme.colors.teal }]}>${moneySaved}</Text>
            <Text style={styles.chipLabel}>Earned</Text>
          </Card>
          
          <Card style={[styles.summaryChip, { backgroundColor: theme.colors.primaryFaded }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(232, 112, 106, 0.1)' }]}>
              <Ionicons name="heart" size={18} color={theme.colors.primary} />
            </View>
            <Text style={[styles.chipValue, { color: theme.colors.primary }]}>${moneyDonated}</Text>
            <Text style={styles.chipLabel}>Donated</Text>
          </Card>

          <Card style={[styles.summaryChip, { backgroundColor: '#F5F3FF' }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Ionicons name="calendar" size={18} color="#7C3AED" />
            </View>
            <Text style={[styles.chipValue, { color: '#7C3AED' }]}>{total}</Text>
            <Text style={styles.chipLabel}>Days</Text>
          </Card>
        </View>

        {/* ── Win Rate Hero ── */}
        <Card style={styles.winHeroCard}>
          <View style={styles.winHeroHeader}>
            <Text style={styles.winHeroTitle}>Win Rate</Text>
            <View style={styles.winHeroBadge}>
              <Text style={styles.winHeroBadgeText}>{period === 'week' ? 'Past 7d' : period === 'month' ? 'This Month' : 'All Time'}</Text>
            </View>
          </View>
          
          <View style={styles.winHeroContent}>
            <View style={styles.winHeroLeft}>
              <CircularProgress
                progress={winRate}
                size={120}
                strokeWidth={14}
                color={winColor}
                label={`${Math.round(winRate * 100)}%`}
                sublabel=""
              />
            </View>
            <View style={styles.winHeroRight}>
              <View style={styles.winStatRow}>
                <View style={[styles.winStatDot, { backgroundColor: theme.colors.teal }]} />
                <View>
                  <Text style={styles.winStatValue}>{wins}</Text>
                  <Text style={styles.winStatLabel}>Wins</Text>
                </View>
              </View>
              <View style={styles.winStatDivider} />
              <View style={styles.winStatRow}>
                <View style={[styles.winStatDot, { backgroundColor: theme.colors.error }]} />
                <View>
                  <Text style={styles.winStatValue}>{misses}</Text>
                  <Text style={styles.winStatLabel}>Misses</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* ── Bar Chart ── */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Last 7 Days</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.teal }]} />
              <Text style={styles.legendLabel}>Under</Text>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
              <Text style={styles.legendLabel}>Over goal</Text>
            </View>
          </View>
          {chartRecords.length === 0 ? (
            <View style={styles.emptyChartBox}>
              <Ionicons name="bar-chart-outline" size={34} color={theme.colors.text.light} />
              <Text style={styles.emptyText}>No data yet — keep tracking!</Text>
            </View>
          ) : (
            <View style={styles.chart}>
              {chartRecords.map((r, i) => {
                const hours = r.duration_minutes / 60;
                const heightPercent = (hours / maxHours) * 100;
                const over = hours > goalHours;
                const barColor = over ? theme.colors.error : theme.colors.teal;
                return (
                  <View key={i} style={styles.chartBar}>
                    <Text style={styles.barValue}>{hours.toFixed(1)}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.bar, { height: `${heightPercent}%`, backgroundColor: barColor }]} />
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

        {/* ── Consistency Calendar ── */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Consistency</Text>
            <Text style={styles.cardSub}>Last 5 weeks</Text>
          </View>
          <ConsistencyCalendar records={allRecords} days={35} />
        </Card>

        {/* ── Impact Sticker ── */}
        {moneyDonated > 0 && (
          <Card style={styles.impactSticker}>
            <View style={styles.impactIconBox}>
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.impactSubtitle}>Real World Impact</Text>
              <Text style={styles.impactValue}>${moneyDonated} Donated</Text>
              <Text style={styles.impactText}>
                Your discipline protected {Math.max(1, moneyDonated * 2)} children from malaria this year.
              </Text>
            </View>
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.cream, // Softer background
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40, 
    paddingTop: 8 
  },

  // ── Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 19,
  },
  periodTabActive: { 
    backgroundColor: theme.colors.primary,
  },
  periodLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
  },
  periodLabelActive: { 
    color: '#FFFFFF' 
  },

  // ── Summary Sticker Chips
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 22,
    gap: 4,
  },
  chipIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  chipValue: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.extrabold,
  },
  chipLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  // ── Win Hero Card
  winHeroCard: {
    padding: 20,
    marginBottom: 16,
  },
  winHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  winHeroTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  winHeroBadge: {
    backgroundColor: theme.colors.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winHeroBadgeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.secondary,
  },
  winHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  winHeroLeft: {
    alignItems: 'center',
  },
  winHeroRight: {
    gap: 16,
  },
  winStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  winStatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  winStatValue: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  winStatLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  winStatDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
  },

  // ── Card Generic
  card: { 
    marginBottom: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  cardSub: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.light,
    backgroundColor: theme.colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  // ── Chart
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: 16,
    marginTop: 10,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '60%',
    backgroundColor: theme.colors.cream,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  barValue: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
    marginBottom: 4,
  },

  // ── Legend
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5 
  },
  legendDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  legendLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginRight: 4,
  },

  // ── Goal Line
  goalLine: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    marginTop: 8,
  },
  goalLineDash: { 
    flex: 1, 
    height: 1, 
    backgroundColor: theme.colors.border,
  },
  goalLineLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
  },

  // ── Empty State
  emptyChartBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
  },

  // ── Impact Sticker
  impactSticker: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  impactIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactSubtitle: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  impactValue: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    marginVertical: 2,
  },
  impactText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
});

