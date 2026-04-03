import { NativeModules, Platform } from 'react-native';

const { ScreenTimeModule } = NativeModules;

export type PermissionStatus = 'authorized' | 'denied' | 'notDetermined';

export const ScreenTimeService = {
  /**
   * Request FamilyControls authorization for ScreenTime access.
   * Must be called before any data fetching.
   */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    if (!ScreenTimeModule) {
      console.warn('ScreenTimeModule not available');
      return false;
    }
    try {
      const granted: boolean = await ScreenTimeModule.requestAuthorization();
      return granted;
    } catch (e) {
      console.error('ScreenTime permission error:', e);
      return false;
    }
  },

  /**
   * Get total screen time in minutes for a given date.
   * Returns 0 if permission not granted or data unavailable.
   */
  async getScreenTime(date: Date): Promise<number> {
    if (Platform.OS !== 'ios') return 0;
    if (!ScreenTimeModule) {
      console.warn('ScreenTimeModule not available');
      return 0;
    }
    try {
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const minutes: number = await ScreenTimeModule.getScreenTime(dateString);
      return minutes;
    } catch (e) {
      console.error('ScreenTime fetch error:', e);
      return 0;
    }
  },

  /**
   * Get screen time for today.
   */
  async getTodayScreenTime(): Promise<number> {
    return ScreenTimeService.getScreenTime(new Date());
  },
};
