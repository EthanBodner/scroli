import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RealityStep } from './RealityStep';
import { ImpactStep } from './ImpactStep';
import { ResetStep } from './ResetStep';
import { Button } from '../../components/ui/Button';
import { LoadingView } from '../../components/ui/LoadingView';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { TrackingService, DayResult } from '../../services/TrackingService';
import { MAX_DAILY_HOURS } from '../../utils/constants';

export const ImpactFlowScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const [goalHours, setGoalHours] = useState(MAX_DAILY_HOURS);
  const [actualHours, setActualHours] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(5);
  const [dayResult, setDayResult] = useState<DayResult>('pending');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      try {
        const [goal, balance, result] = await Promise.all([
          TrackingService.getActiveGoal(user.id),
          TrackingService.getWalletBalance(user.id),
          TrackingService.evaluateDayResult(user.id),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const records = await TrackingService.getRecentRecords(user.id, 1);
        const todayRecord = records.find(r => r.date === today);

        if (goal) setGoalHours(goal.daily_limit_minutes / 60);
        if (todayRecord) setActualHours(todayRecord.duration_minutes / 60);
        setStakeAmount(Math.round(balance / 100));
        setDayResult(result);
      } catch (err) {
        console.error('ImpactFlow load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const impactMessage = `Your $${stakeAmount} protected ${Math.max(1, stakeAmount * 2)} children from malaria for a month`;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RealityStep goalHours={goalHours} actualHours={actualHours} />;
      case 1:
        return <ImpactStep donationAmount={stakeAmount} impactMessage={impactMessage} />;
      case 2:
        return <ResetStep />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.goBack();
    }
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderStep()}
      </View>

      <View style={styles.footer}>
        <Button
          title={currentStep === 2 ? 'Close' : 'Next'}
          onPress={handleNext}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
  },
});
