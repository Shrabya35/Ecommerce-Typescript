import { Metadata } from "next";

import { MenBanner } from "@/assets";

import Hero from "@/components/section/hero";
import ProductCarousel from "@/components/section/productCarousel";
import MiniAbout from "@/components/section/miniAbout";

export const metadata: Metadata = {
  title: "Men's Wear | LynxLine",
  description: "Your affordable Mens store. LynxLine",
};

const link1: { title: string; href: string }[] = [
  { title: "Shop Women", href: "/pages/women" },
];
const link2: { title: string; href: string }[] = [
  { title: "Shop Accessories", href: "/pages/accessories" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      <main className="flex flex-col items-center">
        <Hero
          title1="Unleash Your "
          title2="Swagger!"
          description="Explore the freshest men's arrivals and take your style to the next level."
          ImageSrc={MenBanner.src}
          link1={link1}
          link2={link2}
        />
        <ProductCarousel title="Men's Wear" queryType="type" query="Men" />
        <MiniAbout />
      </main>
    </div>
  );
}
