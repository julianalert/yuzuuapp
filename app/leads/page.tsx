import PageIllustration from "../../components/page-illustration";
import CampaignLeads from '@/components/dashboard/campaign-leads'

export const metadata = {
  title: "Leads - Yuzuu",
  description: "Your leads",
};

export default async function Leads({ searchParams }: { searchParams: Promise<{ campaignId?: string; success?: string; canceled?: string; error?: string }> }) {
  const { campaignId, success, canceled, error } = await searchParams;

  if (!campaignId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign ID Required</h1>
          <p className="text-gray-600">Please provide a valid campaign ID to view leads.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Success/Error messages */}
          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Payment successful! All lead information is now unlocked.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {canceled && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Payment was canceled. You can try again anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Payment error: {error === 'missing_params' && 'Missing parameters'} 
                    {error === 'stripe_not_configured' && 'Stripe not configured'} 
                    {error === 'payment_not_completed' && 'Payment not completed'} 
                    {error === 'update_failed' && 'Failed to update campaign'} 
                    {error === 'completion_failed' && 'Payment completion failed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section header */}
          <div className="pb-12">
            <CampaignLeads campaignId={campaignId} />
          </div>
        </div>
      </div>
    </section>
  )
} 