// Stripe integration — coming soon
// Will be wired in when payment setup screen is built

export const PaymentService = {
  async createPaymentMethod(_billingName: string): Promise<string | null> {
    console.warn('PaymentService: Stripe not yet integrated');
    return null;
  },

  async confirmCharge(_clientSecret: string): Promise<boolean> {
    console.warn('PaymentService: Stripe not yet integrated');
    return false;
  },
};
