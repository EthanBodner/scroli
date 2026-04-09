import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { WelcomeStep } from './WelcomeStep';
import { GoalStep } from './GoalStep';
import { StakeStep } from './StakeStep';
import { CommitmentStep } from './CommitmentStep';
import { CharityStep } from './CharityStep';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { TrackingService } from '../../services/TrackingService';
import { showAlert } from '../../utils/alert';
import { hoursToMinutes } from '../../utils/goalPeriod';

export const OnboardingScreen: React.FC = () => {
  const { user } = useAuth();
  const { completeOnboarding } = useAuthStore();
  const { dailyGoalHours, periodType, stakeAmount, charityId } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Welcome → Goal → Stake → Commitment → Charity
  const steps = [WelcomeStep, GoalStep, StakeStep, CommitmentStep, CharityStep];
  const totalSteps = steps.length;
  const CurrentStepComponent = steps[currentStep];

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (user) {
        try {
          await TrackingService.saveGoal(user.id, hoursToMinutes(dailyGoalHours), periodType);

          const profileUpdate: Record<string, unknown> = {
            has_completed_onboarding: true,
          };
          if (charityId) profileUpdate.default_charity_id = charityId;

          const { error } = await supabase
            .from('profiles')
            .update(profileUpdate)
            .eq('id', user.id);

          if (error) {
            showAlert('Wait...', "We couldn't save your progress. Please try again.");
            return;
          }
        } catch (err) {
          console.error('Error in onboarding completion:', err);
          showAlert('Wait...', "We couldn't save your progress. Please try again.");
          return;
        }
      }
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const nextDisabled = currentStep === totalSteps - 1 && !charityId;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <CurrentStepComponent />
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, index === currentStep && styles.paginationDotActive]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button title="Back" onPress={handleBack} variant="secondary" style={styles.button} />
          )}
          <Button
            title={currentStep === totalSteps - 1 ? "Let's Go!" : 'Next'}
            onPress={handleNext}
            variant="primary"
            style={styles.button}
            disabled={nextDisabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.primary, // Matches welcome hero
  },
  content: { 
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: theme.colors.cream, // Matches step content
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: { 
    flex: 1,
    height: 56,
    borderRadius: 20,
  },
});
