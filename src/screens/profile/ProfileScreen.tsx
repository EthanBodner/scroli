import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LoadingView } from '../../components/ui/LoadingView';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingService } from '../../services/TrackingService';
import { supabase } from '../../services/supabase';
import {
  ACHIEVEMENTS,
  LEVELS,
  getLevel,
  getNextLevel,
  getLevelProgress,
  getUnlockedIds,
  type AchievementStats,
} from '../../utils/achievements';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [wins, setWins] = useState(0);
  const [misses, setMisses] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [moneyDonated, setMoneyDonated] = useState(0);
  const [charityName, setCharityName] = useState<string | null>(null);
  const [timeSavedHours, setTimeSavedHours] = useState(0);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const [profileResult, records, transactions, goal] = await Promise.all([
          supabase.from('profiles').select('full_name, username, charities(name)').eq('id', user.id).single(),
          TrackingService.getRecentRecords(user.id, 365),
          TrackingService.getTransactions(user.id),
          TrackingService.getActiveGoal(user.id),
        ]);

        const profile = profileResult.data;
        setName(profile?.full_name ?? profile?.username ?? user.email?.split('@')[0] ?? 'User');
        setCharityName((profile?.charities as any)?.name ?? null);

        const created = new Date(user.created_at ?? Date.now());
        setMemberSince(created.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

        setMoneySaved(Math.round(transactions.filter(t => t.type === 'refund').reduce((s, t) => s + t.amount_cents, 0) / 100));
        setMoneyDonated(Math.round(transactions.filter(t => t.type === 'donation').reduce((s, t) => s + t.amount_cents, 0) / 100));

        setTotalDays(records.length);
        const winCount = records.filter(r => r.status === 'success').length;
        setWins(winCount);
        setMisses(records.filter(r => r.status === 'failure').length);

        // Time saved: sum of (goal - actual) for all success days
        const limitMins = goal?.daily_limit_minutes ?? 180;
        const savedMins = records
          .filter(r => r.status === 'success')
          .reduce((sum, r) => sum + Math.max(0, limitMins - r.duration_minutes), 0);
        setTimeSavedHours(Math.round(savedMins / 60));

        // Streaks
        const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
        let cur = 0, max = 0, streak = 0;
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (sorted[i].status === 'success') {
            streak++;
            if (i === sorted.length - 1) cur = streak;
          } else {
            max = Math.max(max, streak);
            streak = 0;
          }
        }
        max = Math.max(max, streak);
        setCurrentStreak(cur);
        setLongestStreak(max);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <LoadingView />;

  const total = wins + misses;
  const winRate = total > 0 ? wins / total : 0;
  const initial = name.length > 0 ? name[0].toUpperCase() : '?';

  const level = getLevel(winRate);
  const nextLevel = getNextLevel(winRate);
  const levelProgress = getLevelProgress(winRate);

  const achievementStats: AchievementStats = { wins, misses, currentStreak, longestStreak, totalDays, moneySaved, moneyDonated };
  const unlockedIds = getUnlockedIds(achievementStats);
  const unlockedCount = unlockedIds.size;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>{memberSince}</Text>
          <View style={[styles.levelBadge, { backgroundColor: level.color + '33', borderColor: level.color + '66' }]}>
            <Text style={styles.levelBadgeText}>{level.emoji} {level.name}</Text>
          </View>
        </View>

        {/* Quick Stats Row — streak | time saved | days */}
        <View style={styles.quickRow}>
          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>{currentStreak}</Text>
            <Text style={styles.quickLabel}>Streak</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>{timeSavedHours}h</Text>
            <Text style={styles.quickLabel}>Time saved</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>${moneyDonated}</Text>
            <Text style={styles.quickLabel}>Donated</Text>
          </View>
        </View>

        {/* Charity Impact */}
        {charityName ? (
          <Card style={styles.impactCard}>
            <Text style={styles.impactSupporting}>Supporting</Text>
            <Text style={styles.impactCharity}>{charityName}</Text>
            <View style={styles.impactDivider} />
            <View style={styles.impactRow}>
              <View style={styles.impactStat}>
                <Text style={styles.impactAmount}>${moneyDonated}</Text>
                <Text style={styles.impactStatLabel}>donated</Text>
              </View>
              {moneyDonated > 0 && (
                <Text style={styles.impactMessage}>
                  Your donations have made a real difference
                </Text>
              )}
            </View>
          </Card>
        ) : (
          <Card style={styles.impactCardEmpty}>
            <Text style={styles.impactEmptyTitle}>❤️ Choose a charity</Text>
            <Text style={styles.impactEmptyBody}>Your missed goals will fund a cause you care about. Set it up in Settings.</Text>
          </Card>
        )}

        {/* Level Progress */}
        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelLeft}>
              <Text style={styles.levelEmoji}>{level.emoji}</Text>
              <View>
                <Text style={styles.levelName}>{level.name}</Text>
                <Text style={styles.levelSub}>
                  {nextLevel
                    ? `${nextLevel.emoji} ${nextLevel.name} at ${Math.round(nextLevel.minWinRate * 100)}% win rate`
                    : 'Maximum rank reached'}
                </Text>
              </View>
            </View>
            <View style={styles.levelDots}>
              {LEVELS.map((l, i) => (
                <View key={i} style={[styles.levelDot, { backgroundColor: winRate >= l.minWinRate ? l.color : theme.colors.border }]} />
              ))}
            </View>
          </View>
          {nextLevel && <ProgressBar progress={levelProgress} height={8} />}
        </Card>

        {/* Achievements */}
        <View style={styles.achievementHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.achievementCount}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
        </View>
        <View style={styles.badgeGrid}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <View key={a.id} style={styles.badge}>
                <View style={[
                  styles.badgeIcon,
                  unlocked ? { backgroundColor: level.color + '22' } : styles.badgeLocked,
                ]}>
                  <Text style={[styles.badgeEmoji, !unlocked && styles.emojiLocked]}>{a.emoji}</Text>
                </View>
                <Text style={[styles.badgeName, !unlocked && styles.nameLocked]} numberOfLines={1}>
                  {a.name}
                </Text>
                {!unlocked && <Text style={styles.badgeDesc} numberOfLines={1}>{a.desc}</Text>}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: theme.spacing.xl },

  // Hero
  hero: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    paddingBottom: 48,
    paddingHorizontal: theme.spacing.md,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: -24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  name: {
    fontSize: theme.typography.fontSize.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  meta: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: theme.spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  levelBadgeText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: '#FFFFFF',
  },

  // Quick Stats Row
  quickRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginTop: 36, // overlap hero
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  quickDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
  },
  quickValue: {
    fontSize: theme.typography.fontSize.h2,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  quickLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  // Impact Card
  impactCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primaryFaded,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  impactSupporting: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  impactCharity: {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  impactDivider: {
    height: 1,
    backgroundColor: theme.colors.primaryLight + '44',
    marginBottom: theme.spacing.sm,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  impactStat: {
    alignItems: 'center',
    minWidth: 64,
  },
  impactAmount: {
    fontSize: theme.typography.fontSize.h1,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.primary,
    lineHeight: theme.typography.fontSize.h1 * 1.1,
  },
  impactStatLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  impactMessage: {
    flex: 1,
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.small * 1.5,
  },
  impactCardEmpty: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  impactEmptyTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  impactEmptyBody: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.small * 1.5,
  },

  // Level Card
  levelCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  levelEmoji: { fontSize: 28 },
  levelName: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  levelSub: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 5,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Achievements
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  achievementCount: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  badge: {
    width: '22%',
    alignItems: 'center',
    gap: 4,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLocked: {
    backgroundColor: theme.colors.cream,
  },
  badgeEmoji: { fontSize: 26 },
  emojiLocked: { opacity: 0.3 },
  badgeName: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  nameLocked: { color: theme.colors.text.light },
  badgeDesc: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
});
