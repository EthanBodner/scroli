import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme';
import { formatPercentage } from '../../utils/formatters';

// Mock data
const mockStatsData = {
  winRate: 0.71,
  wins: 5,
  misses: 2,
  moneySaved: 25,
  moneyDonated: 10,
  dailyUsage: [
    { day: 'Mon', hours: 2.1, goal: 3 },
    { day: 'Tue', hours: 2.8, goal: 3 },
    { day: 'Wed', hours: 3.4, goal: 3 },
    { day: 'Thu', hours: 2.5, goal: 3 },
    { day: 'Fri', hours: 2.2, goal: 3 },
    { day: 'Sat', hours: 2.9, goal: 3 },
    { day: 'Sun', hours: 2.3, goal: 3 },
  ],
  impact: 'protected 4 children from malaria',
};

export const StatsScreen: React.FC = () => {
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
              <Text style={styles.winRateValue}>
                {formatPercentage(mockStatsData.winRate)}
              </Text>
            </View>
          </View>
          <View style={styles.winRateBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownValue}>{mockStatsData.wins}</Text>
              <Text style={styles.breakdownLabel}>Wins</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownValue, styles.missesValue]}>
                {mockStatsData.misses}
              </Text>
              <Text style={styles.breakdownLabel}>Misses</Text>
            </View>
          </View>
        </Card>

        {/* Money Cards */}
        <View style={styles.moneyRow}>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyLabel}>Money Saved</Text>
            <Text style={[styles.moneyValue, styles.moneySaved]}>
              ${mockStatsData.moneySaved}
            </Text>
          </Card>
          <Card style={styles.moneyCard}>
            <Text style={styles.moneyLabel}>Money Donated</Text>
            <Text style={[styles.moneyValue, styles.moneyDonated]}>
              ${mockStatsData.moneyDonated}
            </Text>
          </Card>
        </View>

        {/* Weekly Usage Chart */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>This Week's Usage</Text>
          <View style={styles.chart}>
            {mockStatsData.dailyUsage.map((day, index) => {
              const heightPercent = (day.hours / 5) * 100;
              const isOverGoal = day.hours > day.goal;
              return (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isOverGoal
                          ? theme.colors.error
                          : theme.colors.success,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.goalLine}>
            <View style={styles.goalLineDash} />
            <Text style={styles.goalLineLabel}>3h goal</Text>
          </View>
        </Card>

        {/* Impact Card */}
        <Card style={styles.impactCard}>
          <Text style={styles.impactTitle}>Real World Impact</Text>
          <Text style={styles.impactMessage}>
            ${mockStatsData.moneyDonated} {mockStatsData.impact}
          </Text>
        </Card>
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
  card: {
    marginBottom: theme.spacing.md,
  },
  winRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trophy: {
    fontSize: 48,
  },
  winRateLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
  },
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
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  breakdownValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  missesValue: {
    color: theme.colors.error,
  },
  breakdownLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  moneyRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  moneyCard: {
    flex: 1,
    alignItems: 'center',
  },
  moneyLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  moneyValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
  },
  moneySaved: {
    color: theme.colors.success,
  },
  moneyDonated: {
    color: theme.colors.primary,
  },
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
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: '70%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: theme.typography.fontSize.tiny,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  goalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  goalLineDash: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  goalLineLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  impactCard: {
    backgroundColor: theme.colors.cream,
  },
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
});
