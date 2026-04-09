import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

const BENEFITS = [
  { icon: 'time-outline' as const, title: 'Set your daily limit', body: 'Pick how many hours of screen time is healthy for you.' },
  { icon: 'cash-outline' as const, title: 'Put money on the line', body: 'Stake $1–$10/day. Miss your goal and it goes to charity.' },
  { icon: 'trending-up-outline' as const, title: 'Build a real streak', body: 'Watch your habits change when there\'s skin in the game.' },
];

export const WelcomeStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Mascot size={140} usagePercent={0.1} />
        <Text style={styles.heroTitle}>scroli</Text>
        <Text style={styles.heroTagline}>Put money on the line.{'\n'}Get your time back.</Text>
      </View>

      <View style={styles.card}>
        {BENEFITS.map((b, i) => (
          <View key={i} style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitRowBorder]}>
            <View style={styles.iconWrap}>
              <Ionicons name={b.icon} size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitBody}>{b.body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.success} />
          <Text style={styles.disclaimerText}>No money charged until you miss your goal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
    gap: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: theme.spacing.lg,
    paddingTop: 28,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  benefitRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  benefitBody: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.small * theme.typography.lineHeight.relaxed,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  disclaimerText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.success,
  },
});
