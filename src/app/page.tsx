import {
  HomeBanner,
  MenBanner,
  WomenBanner,
  AccessoriesBanner,
} from "@/assets";

import Hero from "@/components/section/hero";
import CategorySection from "@/components/section/categorySection";
import BrandStatement from "@/components/section/BrandStatement";
import ProductCarousel from "@/components/section/productCarousel";
import TestimonialsSection from "@/components/section/Testimonials";
import AppPromotionalSection from "@/components/section/AppPromotion";
import FAQs from "@/components/section/FAQs";

export default function Home() {
  const link1 = [{ title: "Shop Men", href: "/type/men" }];
  const link2 = [{ title: "Shop Women", href: "/type/women" }];

  const images = [
    { src: HomeBanner.src },
    { src: MenBanner.src },
    { src: WomenBanner.src },
    { src: AccessoriesBanner.src },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Lynx"
          title2="Line"
          description="Embrace the power to conquer every challenge, break your limits, and push boundaries. Unleash your inner beast with LynxLine."
          Images={images}
          link1={link1}
          link2={link2}
        />
        <CategorySection />
        <BrandStatement />
        <ProductCarousel title="On Sale" onSale={true} />
        <TestimonialsSection />
        <AppPromotionalSection />
        <FAQs />
      </main>
    </div>
  );
}
