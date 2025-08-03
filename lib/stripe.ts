import Stripe from 'stripe';

// Server-side Stripe instance (only available on server)
export const getStripeServer = () => {
  if (typeof window === 'undefined') {
    console.log('Creating Stripe server instance');
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'EXISTS' : 'MISSING');
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY is not defined');
      return null;
    }

    // Security validation
    if (!secretKey.startsWith('sk_')) {
      console.error('Invalid Stripe secret key format');
      return null;
    }

    // Environment validation
    const isProduction = process.env.NODE_ENV === 'production';
    const isLiveKey = secretKey.startsWith('sk_live_');
    const isTestKey = secretKey.startsWith('sk_test_');

    if (isProduction && !isLiveKey) {
      console.error('Production environment requires live Stripe keys');
      return null;
    }

    if (!isProduction && !isTestKey) {
      console.warn('Development environment should use test Stripe keys');
    }
    
    try {
      return new Stripe(secretKey, {
        apiVersion: '2025-07-30.basil',
      });
    } catch (error) {
      console.error('Error creating Stripe instance:', error);
      return null;
    }
  }
  return null;
};

// Client-side Stripe instance
export const getStripe = () => {
  if (typeof window !== 'undefined') {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
      return null;
    }

    if (!publishableKey.startsWith('pk_')) {
      console.error('Invalid Stripe publishable key format');
      return null;
    }

    return require('@stripe/stripe-js').loadStripe(publishableKey);
  }
  return null;
}; 