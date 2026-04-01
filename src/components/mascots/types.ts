export type MascotType = 'original' | 'wallet' | 'piggy' | 'coinstack';

export type MascotEmotion = 'happy' | 'neutral' | 'sad';

export interface MascotProps {
  size?: number;
  usagePercent: number; // 0 to 1
}

export const getMascotEmotion = (usagePercent: number): MascotEmotion => {
  if (usagePercent < 0.5) return 'happy';
  if (usagePercent < 0.9) return 'neutral';
  return 'sad';
};
