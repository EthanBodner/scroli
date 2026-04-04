import * as React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#7C3AED" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
};

export const App = () => {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.scroli"
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
export default App;

