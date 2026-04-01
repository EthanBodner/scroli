import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RealityStep } from './RealityStep';
import { ImpactStep } from './ImpactStep';
import { ResetStep } from './ResetStep';
import { Button } from '../../components/ui/Button';
import { theme } from '../../theme';

// Mock data
const mockImpactData = {
  goalHours: 3.0,
  actualHours: 3.4,
  donationAmount: 5,
  impactMessage: 'Your $5 protected 2 children from malaria for a month',
};

export const ImpactFlowScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RealityStep goalHours={mockImpactData.goalHours} actualHours={mockImpactData.actualHours} />;
      case 1:
        return <ImpactStep donationAmount={mockImpactData.donationAmount} impactMessage={mockImpactData.impactMessage} />;
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
