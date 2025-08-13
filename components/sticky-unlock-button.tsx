'use client';

import { useState } from 'react';
import PricingModal from './pricing-modal';
import { usePricingModal } from '@/lib/pricing-modal-context';

interface StickyUnlockButtonProps {
  campaignId: string;
  isPaid: boolean;
}

export default function StickyUnlockButton({ campaignId, isPaid }: StickyUnlockButtonProps) {
  const { isModalOpen, openModal } = usePricingModal();

  // Don't show the button if campaign is paid or modal is open
  if (isPaid || isModalOpen) return null;

  return (
    <>
      {/* Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] px-8 py-3"
            >
              <span className="relative inline-flex items-center">
                🔓 Unlock All Leads - $27{' '}
                <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add bottom padding to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
} 