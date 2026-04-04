import { initStripe, confirmPayment, createPaymentMethod } from '@stripe/stripe-react-native';

// Replace with your real Stripe publishable key from https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const PaymentService = {
  /**
   * Initialize Stripe. Call once at app startup inside StripeProvider.
   */
  async init(): Promise<void> {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: 'merchant.com.scroli',
    });
  },

  /**
   * Create a payment method from card details.
   * Returns the payment method ID to store on the server.
   */
  async createPaymentMethod(billingName: string): Promise<string | null> {
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: { name: billingName },
      },
    });

    if (error) {
      console.error('Stripe createPaymentMethod error:', error);
      return null;
    }

    return paymentMethod?.id ?? null;
  },

  /**
   * Confirm a payment using a client secret from your backend.
   * The backend creates a PaymentIntent and returns the client secret.
   */
  async confirmCharge(clientSecret: string): Promise<boolean> {
    const { error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      console.error('Stripe confirmPayment error:', error);
      return false;
    }

    return true;
  },
};
