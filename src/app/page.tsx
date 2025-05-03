import { HomeBanner } from "@/assets";

import Hero from "@/components/section/hero";
import CategorySection from "@/components/section/categorySection";
import ProductCarousel from "@/components/section/productCarousel";
import FAQs from "@/components/section/FAQs";

const link1: { title: string; href: string }[] = [
  { title: "Shop Men", href: "/type/men" },
];
const link2: { title: string; href: string }[] = [
  { title: "Shop Women", href: "/type/women" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Lynx"
          title2="Line"
          description="Embrace the power to conquer every challenge, break your limits, and push boundaries. Unleash your inner beast with LynxLine."
          ImageSrc={HomeBanner.src}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel title="On Sale" onSale={true} />
        <CategorySection />
        <FAQs />
      </main>
    </div>
  );
}
