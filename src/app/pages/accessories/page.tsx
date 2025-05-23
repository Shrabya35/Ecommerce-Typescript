import type { Metadata } from "next";

import { AccessoriesHero1, AccessoriesHero2 } from "@/assets";

import Hero from "@/components/section/hero";
import ProductCarousel from "@/components/section/productCarousel";
import TestimonialsSection from "@/components/section/Testimonials";
import AppPromotionalSection from "@/components/section/AppPromotion";
import FAQs from "@/components/section/FAQs";

export const metadata: Metadata = {
  title: "Accessories | LynxLine",
  description: "Your affordable accessories store. LynxLine",
};

export default function Home() {
  const link1: { title: string; href: string }[] = [
    { title: "Shop Men", href: "/pages/men" },
  ];
  const link2: { title: string; href: string }[] = [
    { title: "Shop Women", href: "/pages/women" },
  ];

  const images = [{ src: AccessoriesHero1.src }, { src: AccessoriesHero2.src }];

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Accessorize Your "
          title2="Adventure!!"
          description="Unlock the latest drops to elevate your style game and conquer any terrain."
          Images={images}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel
          title="Accessories"
          queryType="type"
          query="Accessories"
        />
        <TestimonialsSection />
        <AppPromotionalSection />
        <FAQs />
      </main>
    </div>
  );
}
