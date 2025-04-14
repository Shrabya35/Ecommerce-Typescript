import { WomenBanner } from "@/assets";
import { Metadata } from "next";
import Hero from "@/components/section/hero";
import ProductCarousel from "@/components/section/productCarousel";
import MiniAbout from "@/components/section/miniAbout";

export const metadata: Metadata = {
  title: "Women's Wear | LynxLine",
  description: "Your affordable Women's store. LynxLine",
};

const link1: { title: string; href: string }[] = [
  { title: "Shop Men", href: "/pages/men" },
];
const link2: { title: string; href: string }[] = [
  { title: "Shop Accessories", href: "/pages/accessories" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Embrace Your "
          title2="Elegance!"
          description="Explore the latest arrivals and let your style shine brighter than ever."
          ImageSrc={WomenBanner.src}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel title="Women's Wear" queryType="type" query="Women" />
        <MiniAbout />
      </main>
    </div>
  );
}
