import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  completeOnboarding: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user }),
  setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  completeOnboarding: (user) => set({ user, hasCompletedOnboarding: true }),
}));
