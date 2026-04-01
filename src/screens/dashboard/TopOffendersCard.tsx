import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { theme } from '../../theme';

interface TopOffender {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  time: string;
}

interface TopOffendersCardProps {
  offenders: TopOffender[];
}

export const TopOffendersCard: React.FC<TopOffendersCardProps> = ({ offenders }) => {
  return (
    <Card>
      <Text style={styles.title}>Top Offenders</Text>
      <View style={styles.list}>
        {offenders.map((offender, index) => (
          <View key={index} style={styles.offender}>
            <View style={styles.offenderInfo}>
              <Ionicons name={offender.icon} size={24} color={offender.color} />
              <Text style={styles.offenderName}>{offender.name}</Text>
            </View>
            <Text style={styles.offenderTime}>{offender.time}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.sm,
  },
  offender: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  offenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  offenderName: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  offenderTime: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
});
