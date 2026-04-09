import { create } from 'zustand';
import { MAX_DAILY_HOURS } from '../utils/constants';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

interface OnboardingState {
  dailyGoalHours: number;
  periodType: PeriodType;
  stakeAmount: number;
  charityId: string | null;
  setDailyGoalHours: (hours: number) => void;
  setPeriodType: (period: PeriodType) => void;
  setStakeAmount: (amount: number) => void;
  setCharityId: (id: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  dailyGoalHours: MAX_DAILY_HOURS,
  periodType: 'daily',
  stakeAmount: 5,
  charityId: null,
  setDailyGoalHours: (hours) => set({ dailyGoalHours: hours }),
  setPeriodType: (period) => set({ periodType: period }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
  setCharityId: (id) => set({ charityId: id }),
}));
