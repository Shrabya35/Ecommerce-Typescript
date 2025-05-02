import { Esewa, Khalti } from "@/assets";
import type { StaticImageData } from "next/image";

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
  { code: "AO", label: "Angola" },
  { code: "KI", label: "Kiribati" },
  { code: "UG", label: "Uganda" },
  { code: "CY", label: "Cyprus" },
];
