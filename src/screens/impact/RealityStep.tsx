import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Mascot } from '../../components/mascots/Mascot';

interface RealityStepProps {
  goalHours: number;
  actualHours: number;
}

export const RealityStep: React.FC<RealityStepProps> = ({ goalHours, actualHours }) => {
  const overBy = (actualHours - goalHours).toFixed(1);

  return (
    <View style={styles.container}>
      <Mascot size={180} usagePercent={1} />

      <Text style={styles.title}>Here's the reality</Text>
      <Text style={styles.subtitle}>You went over by {overBy} hours today</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Your goal</Text>
          <Text style={styles.statValue}>{goalHours.toFixed(1)}h</Text>
        </View>
        <View style={styles.vsWrap}>
          <Text style={styles.vsText}>vs</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxOver]}>
          <Text style={styles.statLabel}>You used</Text>
          <Text style={[styles.statValue, styles.statValueOver]}>{actualHours.toFixed(1)}h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.error,
    marginTop: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statBoxOver: {
    backgroundColor: '#FFF1F1',
    borderColor: 'rgba(232, 112, 106, 0.2)',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.extrabold,
    color: theme.colors.text.primary,
  },
  statValueOver: {
    color: theme.colors.error,
  },
  vsWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 1,
    marginHorizontal: -20,
  },
  vsText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.light,
  },
});
