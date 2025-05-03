import type { Metadata } from "next";

import Hero from "@/components/section/hero";
import ProductCarousel from "@/components/section/productCarousel";
import FAQs from "@/components/section/FAQs";

import { AccessoriesBanner } from "@/assets";

export const metadata: Metadata = {
  title: "Accessories | LynxLine",
  description: "Your affordable accessories store. LynxLine",
};

const link1: { title: string; href: string }[] = [
  { title: "Shop Men", href: "/pages/men" },
];
const link2: { title: string; href: string }[] = [
  { title: "Shop Women", href: "/pages/women" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Accessorize Your "
          title2="Adventure!!"
          description="Unlock the latest drops to elevate your style game and conquer any terrain."
          ImageSrc={AccessoriesBanner.src}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel
          title="Accessories"
          queryType="type"
          query="Accessories"
        />
        <FAQs />
      </main>
    </div>
  );
}
