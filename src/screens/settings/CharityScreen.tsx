import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { showAlert } from '../../utils/alert';
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

export const CharityScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [charitiesRes, profileRes] = await Promise.all([
        supabase.from('charities').select('id, name, description').order('name'),
        user
          ? supabase.from('profiles').select('default_charity_id').eq('id', user.id).single()
          : Promise.resolve({ data: null, error: null }),
      ]);
      if (charitiesRes.data) setCharities(charitiesRes.data);
      if (profileRes.data?.default_charity_id) setSelectedId(profileRes.data.default_charity_id);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user || !selectedId) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ default_charity_id: selectedId })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      showAlert('Error', 'Could not save your charity. Please try again.');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Cause</Text>
        <View style={styles.backButton} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subtitle}>
              Your mascot will change to represent your chosen cause.
            </Text>
            {charities.map((charity) => {
              const mascotType = getMascotForCharity(charity.name);
              const selected = selectedId === charity.id;
              return (
                <Pressable
                  key={charity.id}
                  style={[styles.card, selected && styles.cardSelected]}
                  onPress={() => setSelectedId(charity.id)}
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

          <View style={styles.footer}>
            <Pressable
              style={[styles.saveButton, (!selectedId || saving) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!selectedId || saving}
            >
              {saving ? (
                <ActivityIndicator color={theme.colors.text.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </Pressable>
          </View>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.fontSize.body * theme.typography.lineHeight.relaxed,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cream,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
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
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.white,
  },
});
