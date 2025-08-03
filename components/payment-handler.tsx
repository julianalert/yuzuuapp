'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe';

interface PaymentHandlerProps {
  campaignId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentHandler({ campaignId, onSuccess, onError }: PaymentHandlerProps) {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe checkout
      const stripe = await getStripe();
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    setTestLoading(true);
    
    try {
      const response = await fetch('/api/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId }),
      });

      const { success, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Test payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Test payment failed');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative inline-flex items-center">
          {loading ? 'Processing...' : 'Unlock all the info - $47'}{' '}
          <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </span>
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleTestPayment}
          disabled={testLoading}
          className="btn-sm text-xs bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testLoading ? 'Testing...' : 'Test Payment (Dev Only)'}
        </button>
      )}
    </div>
  );
} 