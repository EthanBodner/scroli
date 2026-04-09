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
    paddingHorizontal: 24,
    gap: 12,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amount: {
    fontSize: 72,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: '#FFFFFF',
    lineHeight: 80,
  },
  charityBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  charityName: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 32,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  impactTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  impactMessage: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
