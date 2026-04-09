export type AchievementStats = {
  wins: number;
  misses: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  moneySaved: number;
  moneyDonated: number;
};

export type Achievement = {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  check: (s: AchievementStats) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win',    emoji: '🏆', name: 'First Win',     desc: 'Hit your goal for the first time',  check: (s) => s.wins >= 1 },
  { id: 'week_warrior', emoji: '⚡', name: 'Week Warrior',  desc: '7-day streak',                      check: (s) => s.longestStreak >= 7 },
  { id: 'month_master', emoji: '👑', name: 'Month Master',  desc: '30-day streak',                     check: (s) => s.longestStreak >= 30 },
  { id: 'perfect_week', emoji: '🌟', name: 'Perfect Week',  desc: '7 consecutive wins',                check: (s) => s.longestStreak >= 7 },
  { id: 'saver',        emoji: '💰', name: 'Saver',         desc: '$10 earned back',                   check: (s) => s.moneySaved >= 10 },
  { id: 'contributor',  emoji: '❤️', name: 'Contributor',   desc: '$5 donated to charity',             check: (s) => s.moneyDonated >= 5 },
  { id: 'thirty_days',  emoji: '📅', name: '30 Days',       desc: '30 days tracked',                   check: (s) => s.totalDays >= 30 },
  { id: 'century',      emoji: '🎯', name: 'Century',       desc: '100 days tracked',                  check: (s) => s.totalDays >= 100 },
];

export type LevelInfo = {
  name: string;
  minWinRate: number;
  emoji: string;
  color: string;
};

export const LEVELS: LevelInfo[] = [
  { name: 'Getting Started', minWinRate: 0,   emoji: '🌱', color: '#9CA3AF' },
  { name: 'Building',        minWinRate: 0.3,  emoji: '🔨', color: '#F59E0B' },
  { name: 'Focused',         minWinRate: 0.5,  emoji: '🎯', color: '#3B82F6' },
  { name: 'Disciplined',     minWinRate: 0.7,  emoji: '⚡', color: '#8B5CF6' },
  { name: 'Master',          minWinRate: 0.9,  emoji: '👑', color: '#059669' },
];

export function getLevel(winRate: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (winRate >= LEVELS[i].minWinRate) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(winRate: number): LevelInfo | null {
  const current = getLevel(winRate);
  const idx = LEVELS.findIndex((l) => l.name === current.name);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

/** Returns progress (0–1) within the current level toward the next level */
export function getLevelProgress(winRate: number): number {
  const current = getLevel(winRate);
  const next = getNextLevel(winRate);
  if (!next) return 1;
  const range = next.minWinRate - current.minWinRate;
  return Math.min((winRate - current.minWinRate) / range, 1);
}

export function getUnlockedIds(stats: AchievementStats): Set<string> {
  return new Set(ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.id));
}
