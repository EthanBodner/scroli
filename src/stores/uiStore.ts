import { create } from 'zustand';
import { MascotType } from '../utils/constants';

interface UiState {
  currentMascot: MascotType;
  activeTab: string;
  setCurrentMascot: (mascot: MascotType) => void;
  setActiveTab: (tab: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentMascot: 'original',
  activeTab: 'Dashboard',
  setCurrentMascot: (mascot) => set({ currentMascot: mascot }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
