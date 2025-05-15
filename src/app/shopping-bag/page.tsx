import { Metadata } from "next";
import ShoppingBagPage from "./ShoppingBag";

export const metadata: Metadata = {
  title: "Shopping Bag | LynxLine",
  description: "Review your selected items and proceed to checkout. LynxLine.",
};

export default async function ShoppingBag() {
  return <ShoppingBagPage />;
}
