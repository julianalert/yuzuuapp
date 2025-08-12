'use client';

import Image from "next/image";
import Stripes from "@/public/images/stripes-dark.svg";
import { usePricingModal } from '@/lib/pricing-modal-context';

interface CtaCopyProps {
  campaignId?: string;
}

export default function CtaCopy({ campaignId }: CtaCopyProps) {
  const { openModal } = usePricingModal();
  
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center shadow-xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gray-900"
          data-aos="zoom-y-out"
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-56 w-[480px] rounded-full border-[20px] border-blue-500 blur-3xl will-change-[filter]" />
          </div>
          {/* Stripes illustration */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform"
            aria-hidden="true"
          >
            <Image className="max-w-none" src={Stripes} alt="Stripes" />
          </div>
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 border-y text-3xl font-bold text-gray-200 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-700/.7),transparent)1] md:mb-4 md:text-4xl">
            Unlock your leads potential in seconds.
            </h2>
            <p className="mb-8 text-lg text-gray-500 md:mb-8">
              Get complete lead information, CSV export, and personalized warm intro messages for each prospect.
            </p>
            
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <button
                onClick={openModal}
                className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
              >
                <span className="relative inline-flex items-center">
                  Unlock all the leads information in one click{" "}
                  <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 