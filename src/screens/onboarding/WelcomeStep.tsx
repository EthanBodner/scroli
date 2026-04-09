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
        <Mascot size={150} usagePercent={0.1} />
        <Text style={styles.heroTitle}>Scroli</Text>
        <Text style={styles.heroTagline}>Put money on the line.{'\n'}Get your time back.</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.benefitsContainer}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitCard}>
              <View style={styles.iconWrap}>
                <Ionicons name={b.icon} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footerInfo}>
          <View style={styles.disclaimerBadge}>
            <Ionicons name="shield-checkmark" size={12} color={theme.colors.teal} />
            <Text style={styles.disclaimerText}>No charges until you miss a goal</Text>
          </View>
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
    paddingTop: 48,
    paddingBottom: 40,
    gap: 8,
  },
  heroTitle: {
    fontSize: 40,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroTagline: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsContainer: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  benefitBody: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  footerInfo: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 16,
  },
  disclaimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tealFaded,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.teal,
  },
});
