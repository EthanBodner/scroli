import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme';

// Mock data
const mockProfileData = {
  name: 'Justin',
  email: 'justin@example.com',
  balance: 25,
  impactScore: 127,
  memberSince: 'January 2024',
  totalDaysTracked: 45,
  currentStreak: 6,
  longestStreak: 12,
};

export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Profile</Text>

        {/* Avatar & Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{mockProfileData.name[0]}</Text>
          </View>
          <Text style={styles.name}>{mockProfileData.name}</Text>
          <Text style={styles.email}>{mockProfileData.email}</Text>
        </View>

        {/* Balance Card */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>${mockProfileData.balance}</Text>
          <Text style={styles.balanceDescription}>Money saved by staying on track</Text>
        </Card>

        {/* Impact Score */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Impact Score</Text>
          <Text style={styles.impactValue}>{mockProfileData.impactScore}</Text>
          <Text style={styles.impactDescription}>
            Points earned from successful days and charity contributions
          </Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockProfileData.totalDaysTracked}</Text>
            <Text style={styles.statLabel}>Days Tracked</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockProfileData.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockProfileData.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockProfileData.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </Card>
        </View>
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
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
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
  email: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
  card: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  balanceValue: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  balanceDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  impactValue: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  impactDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
