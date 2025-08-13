'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import Dropdown from "@/components/dropdown";
import MobileMenu from "./mobile-menu";
import PaymentHandler from "@/components/payment-handler";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LeadsHeader() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      if (!campaignId || !supabase) return;

      try {
        const { data: campaign, error } = await supabase
          .from('campaign')
          .select('paid_status')
          .eq('id', campaignId)
          .single();

        if (error) {
          console.error('Error fetching campaign status:', error);
          return;
        }

        setIsPaid(campaign?.paid_status || false);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignStatus();
  }, [campaignId]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Payment Handler */}
          {campaignId && !loading && !isPaid && (
            <div className="flex-shrink-0">
              <PaymentHandler 
                campaignId={campaignId}
                onSuccess={() => {
                  window.location.reload();
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 