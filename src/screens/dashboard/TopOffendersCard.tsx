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
      <Text style={styles.title}>Top Apps</Text>
      <View style={styles.list}>
        {offenders.map((offender, index) => (
          <View key={index} style={styles.offender}>
            <View style={styles.offenderInfo}>
              <View style={[styles.appIcon, { backgroundColor: offender.color }]}>
                <Ionicons name={offender.icon} size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.offenderName}>{offender.name}</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.offenderTime}>{offender.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  offender: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offenderName: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.text.primary,
  },
  timeBadge: {
    backgroundColor: theme.colors.tealFaded,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(114, 192, 152, 0.2)', // Soft Emerald border
  },
  offenderTime: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.teal,
  },
});
