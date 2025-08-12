'use client';

import { useState, useEffect } from 'react';
import PricingV1 from './pricingv1';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function PricingModal({ isOpen, onClose, campaignId }: PricingModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Modal content */}
          <div className="p-6">
            <PricingV1 
              campaignId={campaignId}
              onPaymentStart={() => console.log('Payment started')}
              onPaymentSuccess={() => {
                console.log('Payment successful');
                onClose();
              }}
              onPaymentError={(error) => {
                console.error('Payment error:', error);
                // You could add a toast notification here
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 