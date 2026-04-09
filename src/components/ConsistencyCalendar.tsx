import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type DayRecord = { date: string; status: string };

type Props = {
  records: DayRecord[];
  days?: number; // how many days to show, default 30
};

const DOT_SIZE = 11;
const DOT_GAP = 4;
const COLS = 7;

const STATUS_COLOR: { [key: string]: string } = {
  success: '#22C55E',
  failure: '#EF4444',
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const ConsistencyCalendar: React.FC<Props> = ({ records, days = 35 }) => {
  const statusMap = new Map<string, string>(records.map((r) => [r.date, r.status]));

  // Build array of date strings for the last `days` days ending today,
  // but start from the most recent Monday so columns align.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find last Monday
  const dayOfWeek = today.getDay(); // 0=Sun
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const gridEnd = new Date(today);
  // end on the coming Sunday to complete the last row
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  gridEnd.setDate(today.getDate() + daysToSunday);

  // Start: enough rows to cover `days` days
  const numRows = Math.ceil(days / COLS);
  const gridStart = new Date(gridEnd);
  gridStart.setDate(gridEnd.getDate() - numRows * COLS + 1);

  const cells: { dateStr: string; status: string | null; isFuture: boolean }[] = [];
  const cursor = new Date(gridStart);
  const todayStr = today.toISOString().split('T')[0];

  while (cursor <= gridEnd) {
    const dateStr = cursor.toISOString().split('T')[0];
    const isFuture = dateStr > todayStr;
    cells.push({ dateStr, status: statusMap.get(dateStr) ?? null, isFuture });
    cursor.setDate(cursor.getDate() + 1);
  }

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += COLS) {
    rows.push(cells.slice(i, i + COLS));
  }

  return (
    <View>
      {/* Day labels */}
      <View style={styles.labelRow}>
        {DAY_LABELS.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>

      {/* Dot grid */}
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => {
            const bg = cell.isFuture
              ? 'transparent'
              : cell.status
                ? STATUS_COLOR[cell.status] ?? theme.colors.border
                : theme.colors.border;
            return (
              <View
                key={ci}
                style={[styles.dot, { backgroundColor: bg, opacity: cell.isFuture ? 0 : 1 }]}
              />
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
        <Text style={styles.legendLabel}>Goal met</Text>
        <View style={[styles.legendDot, { backgroundColor: '#EF4444', marginLeft: 12 }]} />
        <Text style={styles.legendLabel}>Missed</Text>
        <View style={[styles.legendDot, { backgroundColor: theme.colors.border, marginLeft: 12 }]} />
        <Text style={styles.legendLabel}>No data</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    marginBottom: DOT_GAP,
  },
  dayLabel: {
    width: DOT_SIZE,
    marginRight: DOT_GAP,
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginRight: DOT_GAP,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
});
