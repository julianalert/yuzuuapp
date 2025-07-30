import ProtectedRoute from '../../../components/auth/protected-route'
import DashboardHeader from '../../../components/ui/dashboard-header'
import PageIllustration from "@/components/page-illustration";
import LatestLeads from '../../../components/dashboard/latest-leads'

export const metadata = {
  title: "Dashboard - Yuzuu",
  description: "Your dashboard",
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      
      <DashboardHeader />
      <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12">
            <LatestLeads />
          </div>
        </div>
      </div>
    </section>
    </ProtectedRoute>
  )
} 