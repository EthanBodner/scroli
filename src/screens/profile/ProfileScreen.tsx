import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LoadingView } from '../../components/ui/LoadingView';
import { Ionicons } from '@expo/vector-icons';
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

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>You</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <Ionicons name="settings-outline" size={22} color={theme.colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* ── Hero section ── */}
        <View style={styles.heroSection}>
          <View style={styles.avatarUnderlay}>
            <View style={styles.avatarBg}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userMeta}>Member since {memberSince}</Text>
        </View>

        {/* ── Metric Chips (Grid) ── */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statChip, { backgroundColor: '#FFF7ED' }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <Ionicons name="flame" size={20} color="#F97316" />
            </View>
            <View>
              <Text style={styles.chipValueText}>{currentStreak}</Text>
              <Text style={styles.chipLabelText}>Day Streak</Text>
            </View>
          </Card>

          <Card style={[styles.statChip, { backgroundColor: theme.colors.tealFaded }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(114, 192, 152, 0.1)' }]}>
              <Ionicons name="time" size={20} color={theme.colors.teal} />
            </View>
            <View>
              <Text style={[styles.chipValueText, { color: theme.colors.teal }]}>{timeSavedHours}h</Text>
              <Text style={styles.chipLabelText}>Time Saved</Text>
            </View>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={[styles.statChip, { backgroundColor: '#F5F3FF' }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Ionicons name="trophy" size={20} color="#7C3AED" />
            </View>
            <View>
              <Text style={[styles.chipValueText, { color: '#7C3AED' }]}>{total > 0 ? `${Math.round(winRate * 100)}%` : '—'}</Text>
              <Text style={styles.chipLabelText}>Win Rate</Text>
            </View>
          </Card>

          <Card style={[styles.statChip, { backgroundColor: theme.colors.primaryFaded }]}>
            <View style={[styles.chipIconBox, { backgroundColor: 'rgba(232, 112, 106, 0.1)' }]}>
              <Ionicons name="heart" size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={[styles.chipValueText, { color: theme.colors.primary }]}>${moneyDonated}</Text>
              <Text style={styles.chipLabelText}>Donated</Text>
            </View>
          </Card>
        </View>

        {/* ── Level Sticker ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Your Rank</Text>
        </View>
        <Card style={styles.levelSticker}>
          <View style={styles.levelLayout}>
            <View style={styles.levelIconSquare}>
              <Ionicons name={level.icon as any} size={32} color={theme.colors.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelStickerName}>{level.name}</Text>
              <Text style={styles.levelStickerProgress}>
                {nextLevel
                  ? `${Math.round(levelProgress * 100)}% to ${nextLevel.name}`
                  : '🏆 Maximum rank achieved!'}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(levelProgress * 100)}%` }]} />
          </View>
        </Card>

        {/* ── Charity Impact ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Giving Impact</Text>
        </View>
        {charityName ? (
          <Card style={styles.impactSticker}>
            <View style={styles.impactHeader}>
              <View style={styles.impactIconCircle}>
                <Ionicons name="heart" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.impactSubtitle}>Supporting</Text>
                <Text style={styles.impactMainTitle}>{charityName}</Text>
              </View>
              <View style={styles.impactAmtBox}>
                <Text style={styles.impactAmtValue}>${moneyDonated}</Text>
              </View>
            </View>
            <Text style={styles.impactDescription}>
              Your missed goals fund world-class charities. Thank you for your impact!
            </Text>
          </Card>
        ) : (
          <Card style={styles.impactEmptySticker}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.impactEmptyTitle}>Choose a charity</Text>
              <Text style={styles.impactEmptyBody}>Your missed goals will support a cause you care about.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.light} />
          </Card>
        )}

        {/* ── Achievements ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Achievements</Text>
          <View style={styles.achieveBadgeCount}>
            <Text style={styles.achieveBadgeCountText}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
          </View>
        </View>
        <Card style={styles.badgesCard}>
          <View style={styles.badgeGrid}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedIds.has(a.id);
              return (
                <View key={a.id} style={styles.badgeItem}>
                  <View style={[
                    styles.badgeCircle, 
                    unlocked ? { backgroundColor: theme.colors.primaryFaded } : styles.badgeLockedBg
                  ]}>
                    <Ionicons
                      name={a.icon as any}
                      size={22}
                      color={unlocked ? theme.colors.primary : theme.colors.text.light}
                      style={!unlocked ? { opacity: 0.3 } : undefined}
                    />
                    {!unlocked && (
                      <View style={styles.badgeLockOverlay}>
                        <Ionicons name="lock-closed" size={10} color={theme.colors.text.light} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeItemName, !unlocked && styles.badgeItemNameLocked]} numberOfLines={2}>
                    {a.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

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
    paddingBottom: 60,
    paddingTop: 8,
  },

  // ── Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // ── Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarUnderlay: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(232, 112, 106, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  // ── Stats Grid (Chips)
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 20,
  },
  chipIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipValueText: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  chipLabelText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  // ── Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitleText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  achieveBadgeCount: {
    backgroundColor: theme.colors.primaryFaded,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  achieveBadgeCountText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },

  // ── Level Sticker
  levelSticker: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.teal, // Emerald background as requested
  },
  levelLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  levelIconSquare: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelStickerName: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  levelStickerProgress: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },

  // ── Impact Sticker
  impactSticker: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  impactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactSubtitle: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  impactMainTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  impactAmtBox: {
    backgroundColor: theme.colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  impactAmtValue: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.primary,
  },
  impactDescription: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  impactEmptySticker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  impactEmptyTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  impactEmptyBody: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },

  // ── Badges Card
  badgesCard: {
    padding: 16,
    marginBottom: 20,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '22%',
    alignItems: 'center',
    gap: 6,
  },
  badgeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeLockedBg: {
    backgroundColor: '#F3F4F6',
  },
  badgeLockOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeItemName: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  badgeItemNameLocked: {
    color: theme.colors.text.light,
  },
});

