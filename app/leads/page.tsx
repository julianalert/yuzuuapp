import { Suspense } from 'react';
import LeadsContent from '@/components/leads-content';

export const metadata = {
  title: "Leads - Yuzuu",
  description: "Your leads",
};

export default function Leads() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    }>
      <LeadsContent />
    </Suspense>
  );
} 