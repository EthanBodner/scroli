import { create } from 'zustand';
import { MAX_DAILY_HOURS } from '../utils/constants';

interface OnboardingState {
  dailyGoalHours: number;
  stakeAmount: number;
  setDailyGoalHours: (hours: number) => void;
  setStakeAmount: (amount: number) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  dailyGoalHours: MAX_DAILY_HOURS,
  stakeAmount: 5,
  setDailyGoalHours: (hours) => set({ dailyGoalHours: hours }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
}));
