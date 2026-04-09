import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';
import { WalletMascot } from '../../components/mascots/WalletMascot';
import { PiggyMascot } from '../../components/mascots/PiggyMascot';
import { CoinStackMascot } from '../../components/mascots/CoinStackMascot';
import { getMascotForCharity } from '../../utils/charityMascots';
import type { MascotType } from '../../utils/constants';

interface ImpactStepProps {
  donationAmount: number;
  impactMessage: string;
  charityName?: string | null;
}

function CharityMascot({ type }: { type: MascotType }) {
  const props = { size: 180, usagePercent: 0.1 };
  switch (type) {
    case 'wallet': return <WalletMascot {...props} />;
    case 'piggy': return <PiggyMascot {...props} />;
    case 'coinstack': return <CoinStackMascot {...props} />;
    default: return <Mascot {...props} />;
  }
}

export const ImpactStep: React.FC<ImpactStepProps> = ({ donationAmount, impactMessage, charityName }) => {
  const mascotType = getMascotForCharity(charityName);

  return (
    <LinearGradient colors={[theme.colors.gradient.start, theme.colors.gradient.end]} style={styles.container}>
      <CharityMascot type={mascotType} />

      <Text style={styles.amountLabel}>going to charity</Text>
      <Text style={styles.amount}>${donationAmount}</Text>

      {charityName && (
        <View style={styles.charityBadge}>
          <Text style={styles.charityName}>{charityName}</Text>
        </View>
      )}

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Real World Impact</Text>
        <Text style={styles.impactMessage}>{impactMessage}</Text>
      </View>

      <Text style={styles.subtitle}>
        While you lost today, someone else won because of you.
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: 8,
  },
  amountLabel: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    marginTop: theme.spacing.sm,
  },
  amount: {
    fontSize: 64,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    lineHeight: 72,
  },
  charityBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  charityName: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semibold,
    color: '#FFFFFF',
  },
  impactCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
    width: '100%',
    ...theme.shadows.md,
  },
  impactTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  impactMessage: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
});
