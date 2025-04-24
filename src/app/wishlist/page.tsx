import { Metadata } from "next";

import WishlistPage from "./wishlistPage";

export const metadata: Metadata = {
  title: "Wishlist | LynxLine",
  description: "Your saved style picks, all in one place. LynxLine.",
};

export default function Home() {
  return (
    <div>
      <WishlistPage />
    </div>
  );
}
