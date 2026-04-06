import { MascotType } from './constants';

export const CHARITY_MASCOT_MAP: Record<string, MascotType> = {
  'Against Malaria Foundation': 'original',
  'GiveDirectly': 'wallet',
  'Malaria No More': 'piggy',
  'Save the Children': 'coinstack',
};

export function getMascotForCharity(charityName: string | null | undefined): MascotType {
  if (!charityName) return 'original';
  return CHARITY_MASCOT_MAP[charityName] ?? 'original';
}
