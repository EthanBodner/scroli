import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';
import { WalletMascot } from '../../components/mascots/WalletMascot';
import { PiggyMascot } from '../../components/mascots/PiggyMascot';
import { CoinStackMascot } from '../../components/mascots/CoinStackMascot';
import { useUiStore } from '../../stores/uiStore';
import { MASCOT_TYPES, MascotType } from '../../utils/constants';

const MASCOT_LABELS: Record<MascotType, string> = {
  original: 'Original',
  wallet: 'Wallet',
  piggy: 'Piggy Bank',
  coinstack: 'Coin Stack',
};

function MascotPreview({ type, size }: { type: MascotType; size: number }) {
  const props = { size, usagePercent: 0.3 };
  switch (type) {
    case 'wallet': return <WalletMascot {...props} />;
    case 'piggy': return <PiggyMascot {...props} />;
    case 'coinstack': return <CoinStackMascot {...props} />;
    default: return <Mascot {...props} />;
  }
}

export const MascotScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentMascot, setCurrentMascot } = useUiStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mascot Lab</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Choose your Scroli companion</Text>

        <View style={styles.grid}>
          {MASCOT_TYPES.map((type) => (
            <Pressable
              key={type}
              style={[styles.card, currentMascot === type && styles.cardSelected]}
              onPress={() => setCurrentMascot(type)}
            >
              <MascotPreview type={type} size={100} />
              <Text style={[styles.cardLabel, currentMascot === type && styles.cardLabelSelected]}>
                {MASCOT_LABELS[type]}
              </Text>
              {currentMascot === type && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={14} color={theme.colors.text.white} />
                </View>
              )}
            </Pressable>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryFaded,
  },
  cardLabel: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  cardLabelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
