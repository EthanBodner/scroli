import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type DayStatus = 'check' | 'miss' | 'future';

interface WeekCalendarProps {
  weekHistory: DayStatus[];
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const WeekCalendar: React.FC<WeekCalendarProps> = ({ weekHistory }) => {
  const getStatusColor = (status: DayStatus) => {
    switch (status) {
      case 'check':
        return theme.colors.teal;
      case 'miss':
        return theme.colors.error;
      case 'future':
        return theme.colors.border;
    }
  };

  return (
    <View style={styles.container}>
      {DAYS.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <View
            style={[
              styles.circle,
              { backgroundColor: getStatusColor(weekHistory[index]) },
            ]}
          >
            {weekHistory[index] === 'check' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
            {weekHistory[index] === 'miss' && (
              <Text style={styles.xmark}>✕</Text>
            )}
          </View>
          <Text style={styles.dayLabel}>{day}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  dayContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold,
  },
  xmark: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dayLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
