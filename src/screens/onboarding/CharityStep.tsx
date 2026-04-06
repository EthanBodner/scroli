import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { supabase } from '../../services/supabase';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { getMascotForCharity } from '../../utils/charityMascots';
import { Mascot } from '../../components/mascots/Mascot';
import { WalletMascot } from '../../components/mascots/WalletMascot';
import { PiggyMascot } from '../../components/mascots/PiggyMascot';
import { CoinStackMascot } from '../../components/mascots/CoinStackMascot';
import type { MascotType } from '../../utils/constants';

interface Charity {
  id: string;
  name: string;
  description: string;
}

function MascotPreview({ type }: { type: MascotType }) {
  const props = { size: 64, usagePercent: 0.1 };
  switch (type) {
    case 'wallet': return <WalletMascot {...props} />;
    case 'piggy': return <PiggyMascot {...props} />;
    case 'coinstack': return <CoinStackMascot {...props} />;
    default: return <Mascot {...props} />;
  }
}

export const CharityStep: React.FC = () => {
  const { charityId, setCharityId } = useOnboardingStore();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('charities')
      .select('id, name, description')
      .order('name')
      .then(({ data }) => {
        if (data) setCharities(data);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your cause</Text>
      <Text style={styles.subtitle}>
        When you miss your goal, your stake goes here.{'\n'}Your mascot will represent this charity.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {charities.map((charity) => {
            const mascotType = getMascotForCharity(charity.name);
            const selected = charityId === charity.id;
            return (
              <Pressable
                key={charity.id}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => setCharityId(charity.id)}
              >
                <View style={styles.mascotWrap}>
                  <MascotPreview type={mascotType} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardName, selected && styles.cardNameSelected]}>
                    {charity.name}
                  </Text>
                  <Text style={styles.cardDescription}>{charity.description}</Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.lg,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: theme.spacing.sm,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryFaded,
  },
  mascotWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  cardNameSelected: {
    color: theme.colors.primary,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.small * 1.4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
});
