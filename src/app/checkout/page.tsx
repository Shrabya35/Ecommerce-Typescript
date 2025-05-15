import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutPage from "./CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | LynxLine",
  description:
    "Securely complete your purchase and get your favorite styles delivered. LynxLine.",
};

export default async function Checkout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("checkout_token");

  if (!token) {
    redirect("/shopping-bag");
  }

  return <CheckoutPage />;
}
