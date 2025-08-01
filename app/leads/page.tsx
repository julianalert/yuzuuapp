import PageIllustration from "../../components/page-illustration";
import CampaignLeads from '@/components/dashboard/campaign-leads'

export const metadata = {
  title: "Leads - Yuzuu",
  description: "Your leads",
};

export default async function Leads({ searchParams }: { searchParams: Promise<{ campaignId?: string }> }) {
  const { campaignId } = await searchParams;

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
          {/* Section header */}
          <div className="pb-12">
            <CampaignLeads campaignId={campaignId} />
          </div>
        </div>
      </div>
    </section>
  )
} 