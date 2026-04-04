import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { LoadingView } from '../../components/ui/LoadingView';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingService } from '../../services/TrackingService';
import { supabase } from '../../services/supabase';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [balanceCents, setBalanceCents] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      try {
        const [profileResult, balance, records] = await Promise.all([
          supabase.from('profiles').select('full_name, username, updated_at').eq('id', user.id).single(),
          TrackingService.getWalletBalance(user.id),
          TrackingService.getRecentRecords(user.id, 365),
        ]);

        // Name
        const profile = profileResult.data;
        setName(profile?.full_name ?? profile?.username ?? user.email?.split('@')[0] ?? 'User');

        // Balance
        setBalanceCents(balance);

        // Member since
        const created = new Date(user.created_at ?? Date.now());
        setMemberSince(created.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

        // Stats from records
        setTotalDays(records.length);

        // Calculate current + longest streak from consecutive successes
        const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
        let cur = 0, max = 0, streak = 0;
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (sorted[i].status === 'success') {
            streak++;
            if (i === sorted.length - 1) cur = streak;
          } else {
            if (cur === 0 && streak === 0) cur = 0;
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

  const balanceDollars = Math.round(balanceCents / 100);
  const initial = name.length > 0 ? name[0].toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Profile</Text>

        {/* Avatar & Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {/* Balance Card */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>${balanceDollars}</Text>
          <Text style={styles.balanceDescription}>Money saved by staying on track</Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalDays}</Text>
            <Text style={styles.statLabel}>Days Tracked</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </Card>
        </View>
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
  profileHeader: { alignItems: 'center', marginBottom: theme.spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.white,
  },
  name: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: { fontSize: theme.typography.fontSize.body, color: theme.colors.text.secondary },
  card: { marginBottom: theme.spacing.md, alignItems: 'center' },
  cardLabel: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs },
  balanceValue: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  balanceDescription: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: { fontSize: theme.typography.fontSize.small, color: theme.colors.text.secondary, textAlign: 'center' },
});
