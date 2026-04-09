import type { PeriodType } from '../stores/onboardingStore';

export interface PeriodConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultHours: number;
}

export const PERIOD_CONFIG: Record<PeriodType, PeriodConfig> = {
  daily:   { label: 'Daily',   unit: 'day',   min: 0.5, max: 8,   step: 0.5, defaultHours: 3 },
  weekly:  { label: 'Weekly',  unit: 'week',  min: 3,   max: 56,  step: 1,   defaultHours: 21 },
  monthly: { label: 'Monthly', unit: 'month', min: 15,  max: 240, step: 5,   defaultHours: 90 },
};

export const PERIOD_TYPES: PeriodType[] = ['daily', 'weekly', 'monthly'];

/** Convert period limit hours to minutes for storage */
export const hoursToMinutes = (hours: number) => Math.round(hours * 60);

/** Daily-equivalent hours for progress calculation */
export function getDailyEquivalent(limitHours: number, period: PeriodType): number {
  if (period === 'weekly') return limitHours / 7;
  if (period === 'monthly') return limitHours / 30;
  return limitHours;
}

/** Label for the period progress shown on dashboard */
export function getPeriodLabel(period: PeriodType): string {
  if (period === 'weekly') return 'this week';
  if (period === 'monthly') return 'this month';
  return 'today';
}
