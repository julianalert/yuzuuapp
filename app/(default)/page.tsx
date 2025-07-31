export const metadata = {
  title: "Find Clients For Your B2B SaaS - Yuzuu",
  description: "Get 10 qualified prospects in your inbox every morning showing high buying intent for your offer. Perfectly matched to your ICP. 100% free.",
};

import MainHero from "@/components/main-hero";
// import BusinessCategories from "@/components/business-categories";
import LargeTestimonial from "@/components/large-testimonial";
import FeaturesPlanet from "@/components/features-planet";
import Features from "@/components/features-home";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <MainHero />
      {/* <BusinessCategories /> */}
      <LargeTestimonial />
      <FeaturesPlanet />
      {/*<Features />*/}
      <TestimonialsCarousel />
      <Cta />
    </>
  );
}
