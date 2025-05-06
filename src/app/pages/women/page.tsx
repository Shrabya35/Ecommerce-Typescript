import { Metadata } from "next";

import { WomenHero1, WomenHero2 } from "@/assets";

import Hero from "@/components/section/hero";
import ProductCarousel from "@/components/section/productCarousel";
import TestimonialsSection from "@/components/section/Testimonials";
import AppPromotionalSection from "@/components/section/AppPromotion";
import FAQs from "@/components/section/FAQs";

export const metadata: Metadata = {
  title: "Women's Wear | LynxLine",
  description: "Your affordable Women's store. LynxLine",
};

export default function Home() {
  const link1: { title: string; href: string }[] = [
    { title: "Shop Men", href: "/pages/men" },
  ];
  const link2: { title: string; href: string }[] = [
    { title: "Shop Accessories", href: "/pages/accessories" },
  ];

  const images = [{ src: WomenHero1.src }, { src: WomenHero2.src }];

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Embrace Your "
          title2="Elegance!"
          description="Explore the latest arrivals and let your style shine brighter than ever."
          Images={images}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel title="Women's Wear" queryType="type" query="Women" />
        <TestimonialsSection />
        <AppPromotionalSection />
        <FAQs />
      </main>
    </div>
  );
}
