'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe';
import PricingPopup from './pricing-popup';
import PricingModal from './pricing-modal';

interface PaymentHandlerProps {
  campaignId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentHandler({ campaignId, onSuccess, onError }: PaymentHandlerProps) {
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

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



  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowPricingModal(true)}
            disabled={loading}
            className="btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            <span className="relative inline-flex items-center">
              {loading ? 'Processing...' : 'Unlock all the info'}{' '}
              <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                -&gt;
              </span>
            </span>
          </button>
          
          {/* <button
            onClick={() => setShowPricing(true)}
            className="btn-sm bg-gray-800 font-normal text-gray-200 shadow-sm hover:bg-gray-900"
          >
            <svg
              className="mr-2 fill-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
            >
              <path d="M6.669.715a1 1 0 0 1-.673 1.244 6.014 6.014 0 0 0-4.037 4.037 1 1 0 0 1-1.917-.571A8.014 8.014 0 0 1 5.425.042a1 1 0 0 1 1.244.673ZM7.71 4.71a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9.996.042a1 1 0 1 0-.57 1.917 6.014 6.014 0 0 1 4.037 4.037 1 1 0 0 0 1.917-.571A8.015 8.015 0 0 0 9.996.042Zm4.71 8.71a1 1 0 0 1 .674 1.243 8.015 8.015 0 0 1-5.384 5.384 1 1 0 0 1-.57-1.917 6.014 6.014 0 0 0 4.037-4.037 1 1 0 0 1 1.243-.673ZM1.96 9.425a1 1 0 1 0-1.917.57 8.014 8.014 0 0 0 5.383 5.384 1 1 0 0 0 .57-1.917A6.014 6.014 0 0 1 1.96 9.425Z" />
            </svg>
            View Plans
          </button> */}
        </div>
      </div>
      
      <PricingPopup 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
      
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)}
        campaignId={campaignId}
      />
    </>
  );
} 