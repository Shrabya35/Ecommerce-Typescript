import { Esewa, Khalti } from "@/assets";
import type { StaticImageData } from "next/image";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  content: string;
  product: string;
};

export const offers: string[] = [
  "🎉 Shop over $75 & enjoy FREE delivery🚚💰",
  "🌟 Discover our exclusive deals & discounts this month! 💸✨",
  "💳 Get 20% off on your purchase with code BlackNigga! 💳🛍️",
  "🎁 Get a FREE mystery gift on orders over $50! 🎉",
  "💳 Save 15% when you pay with Khalti or Esewa! 💰",
  "👀 Get early access to drops when you subscribe! 🔓",
  "📸 Tag us @LynxLine to get featured & win prizes! 🎥",
];

export const paymentOptions: { image: StaticImageData; label: string }[] = [
  { image: Esewa, label: "Esewa" },
  { image: Khalti, label: "Khalti" },
];

export const countries: { code: string; label: string }[] = [
  { code: "NP", label: "Nepal" },
  { code: "IN", label: "India" },
  { code: "CN", label: "China" },
  { code: "IM", label: "IsleOfMan" },
  { code: "EU", label: "Europe" },
  { code: "AO", label: "Angola" },
  { code: "KI", label: "Kiribati" },
  { code: "UG", label: "Uganda" },
  { code: "CY", label: "Cyprus" },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Professional Runner",
    image: "/api/placeholder/64/64",
    rating: 5,
    content:
      "LynxLine's compression leggings have been a game-changer for my marathon training. The comfort and support they provide are unmatched by any other brand I've tried.",
    product: "Performance Compression Leggings",
  },
  {
    id: 2,
    name: "Jordan Chen",
    role: "Fitness Enthusiast",
    image: "/api/placeholder/64/64",
    rating: 5,
    content:
      "I've been using the LynxLine training shoes for 6 months now and they still feel as good as day one. Perfect balance of support and flexibility for my HIIT workouts.",
    product: "Elite Training Shoes",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    role: "Yoga Instructor",
    image: "/api/placeholder/64/64",
    rating: 4,
    content:
      "The breathable fabric of LynxLine's yoga set makes it perfect for hot yoga sessions. The material wicks away sweat efficiently while maintaining its shape.",
    product: "Breathable Yoga Set",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    role: "Basketball Coach",
    image: "/api/placeholder/64/64",
    rating: 5,
    content:
      "My team has been exclusively using LynxLine basketballs for the past season. The grip and durability are exceptional, and the players love them.",
    product: "Pro Basketball",
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Cycling Enthusiast",
    image: "/api/placeholder/64/64",
    rating: 5,
    content:
      "The cycling shorts from LynxLine offer incredible padding and support for long rides. I recently completed a 100-mile event and felt comfortable throughout.",
    product: "Endurance Cycling Shorts",
  },
];
