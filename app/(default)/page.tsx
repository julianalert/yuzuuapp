export const metadata = {
  title: "Find Clients For Your B2B Business - Yuzuu",
  description: "Get 500 qualified prospects ready to buy your offer in seconds. Perfectly matched to your ICP. 100% free.",
};

import MainHero from "@/components/main-hero";
// import BusinessCategories from "@/components/business-categories";
import LargeTestimonial from "@/components/large-testimonial";
import FeaturesPlanet from "@/components/features-planet";
import Features from "@/components/features-home";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import BusinessCategories from "@/components/business-categories";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <MainHero />
      <LargeTestimonial />
      <FeaturesPlanet />
      <Features />
      {/*<Features />*/}
      <TestimonialsCarousel />
      <Cta />
    </>
  );
}
