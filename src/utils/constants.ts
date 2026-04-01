export const MAX_DAILY_HOURS = 3;
export const STAKE_OPTIONS = [1, 5, 10];

export const MASCOT_TYPES = ['original', 'wallet', 'piggy', 'coinstack'] as const;
export type MascotType = typeof MASCOT_TYPES[number];
