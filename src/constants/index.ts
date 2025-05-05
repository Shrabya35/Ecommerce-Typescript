import { Esewa, Khalti } from "@/assets";
import type { StaticImageData } from "next/image";

type Testimonial = {
  id: number;
  name: string;
  role: string;
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
    rating: 5,
    content:
      "LynxLine's compression leggings have been a game-changer for my marathon training. The comfort and support they provide are unmatched by any other brand I've tried.",
    product: "Performance Compression Leggings",
  },
  {
    id: 2,
    name: "Jordan Chen",
    role: "Fitness Enthusiast",
    rating: 5,
    content:
      "I've been using the LynxLine training shoes for 6 months now and they still feel as good as day one. Perfect balance of support and flexibility for my HIIT workouts.",
    product: "Elite Training Shoes",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    role: "Yoga Instructor",
    rating: 4,
    content:
      "The breathable fabric of LynxLine's yoga set makes it perfect for hot yoga sessions. The material wicks away sweat efficiently while maintaining its shape.",
    product: "Breathable Yoga Set",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    role: "Basketball Coach",
    rating: 5,
    content:
      "My team has been exclusively using LynxLine basketballs for the past season. The grip and durability are exceptional, and the players love them.",
    product: "Pro Basketball",
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Cycling Enthusiast",
    rating: 5,
    content:
      "The cycling shorts from LynxLine offer incredible padding and support for long rides. I recently completed a 100-mile event and felt comfortable throughout.",
    product: "Endurance Cycling Shorts",
  },
];

export const faqs = [
  {
    question: "What is Lynxline?",
    answer:
      "Lynxline is your go-to online store for premium sportswear, stylish accessories, and authentic football jerseys. We blend performance with style to support your active lifestyle.",
  },
  {
    question: "Do you sell original football jerseys?",
    answer:
      "Yes! We offer 100% authentic and high-quality football jerseys. Whether you're supporting your favorite club or national team, we've got you covered.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Simply browse our products, add your favorites to the cart, and proceed to checkout. We’ve made the process smooth, secure, and mobile-friendly.",
  },
  {
    question: "How often do you update your inventory?",
    answer:
      "We regularly update our inventory with new deals and products. We recommend checking back often for unbeatable bargains and to find the latest additions to our collection of premium sportswear and equipment.",
  },
  {
    question: "Need help or have a question?",
    answer:
      "Our support team is here for you. Reach us via email (support@lynxline.com) or DM us on Instagram @lynxline.official.",
  },
];
