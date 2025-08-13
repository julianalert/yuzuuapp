"use client";

import { useEffect, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/ui/footer";
import LeadsHeaderClient from "@/components/ui/leads-header-client";
import { PricingModalProvider } from "@/lib/pricing-modal-context";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <PricingModalProvider>
      <div className="flex min-h-screen flex-col">
        <Suspense fallback={<div className="h-14" />}>
          <LeadsHeaderClient />
        </Suspense>
        <main className="grow">{children}</main>
        <Footer border={true} />
      </div>
    </PricingModalProvider>
  );
} 