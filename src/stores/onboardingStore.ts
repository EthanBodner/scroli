import { create } from 'zustand';
import { MAX_DAILY_HOURS } from '../utils/constants';

interface OnboardingState {
  dailyGoalHours: number;
  stakeAmount: number;
  charityId: string | null;
  setDailyGoalHours: (hours: number) => void;
  setStakeAmount: (amount: number) => void;
  setCharityId: (id: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  dailyGoalHours: MAX_DAILY_HOURS,
  stakeAmount: 5,
  charityId: null,
  setDailyGoalHours: (hours) => set({ dailyGoalHours: hours }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
  setCharityId: (id) => set({ charityId: id }),
}));
