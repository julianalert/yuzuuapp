export const metadata = {
  title: "Home - Simple",
  description: "Page description",
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
