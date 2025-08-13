'use client';

import { usePricingModal } from '@/lib/pricing-modal-context';

interface CtaCopyProps {
  campaignId?: string;
}

export default function CtaCopy({ campaignId }: CtaCopyProps) {
  const { openModal } = usePricingModal();
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Get Full Access to Your Leads
        </h3>
        <p className="text-gray-600">
          Get complete lead information, CSV export, and personalized warm intro messages for each prospect.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Features */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl">📧</div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">Complete Contact Info</h4>
                <p className="text-sm text-gray-600">
                  Get verified email addresses and phone numbers for decision makers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl">💬</div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">AI-Generated Intros</h4>
                <p className="text-sm text-gray-600">
                  Personalized warm introduction messages for each prospect
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl">📊</div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">Export & Analyze</h4>
                <p className="text-sm text-gray-600">
                  Download all data in CSV format for your CRM or analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-center">
              🎯 One-time payment, lifetime access
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="font-bold text-gray-900">$27</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Access:</span>
                <span className="font-bold text-blue-600">Lifetime</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Updates:</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={openModal}
              className="w-full btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%]"
            >
              <span className="relative inline-flex items-center">
                Unlock All Leads ($27 one-time){" "}
                <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              🔒 Secure payment • Instant access • No recurring fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 