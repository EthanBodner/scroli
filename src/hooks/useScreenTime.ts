import { useState, useEffect, useCallback } from 'react';
import { ScreenTimeService } from '../services/ScreenTimeService';

interface ScreenTimeState {
  minutesToday: number;
  permissionGranted: boolean;
  loading: boolean;
  error: string | null;
}

export const useScreenTime = () => {
  const [state, setState] = useState<ScreenTimeState>({
    minutesToday: 0,
    permissionGranted: false,
    loading: true,
    error: null,
  });

  const requestAndFetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const granted = await ScreenTimeService.requestPermission();
      if (!granted) {
        setState(prev => ({
          ...prev,
          permissionGranted: false,
          loading: false,
          error: 'ScreenTime permission denied',
        }));
        return;
      }

      const minutes = await ScreenTimeService.getTodayScreenTime();
      setState({
        minutesToday: minutes,
        permissionGranted: true,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch screen time',
      }));
    }
  }, []);

  useEffect(() => {
    requestAndFetch();
  }, [requestAndFetch]);

  return {
    ...state,
    hoursToday: state.minutesToday / 60,
    refetch: requestAndFetch,
  };
};
