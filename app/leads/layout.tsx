"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import LeadsHeader from "@/components/ui/leads-header";
import Footer from "@/components/ui/footer";
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
        <LeadsHeader />
        <main className="grow">{children}</main>
        <Footer border={true} />
      </div>
    </PricingModalProvider>
  );
} 