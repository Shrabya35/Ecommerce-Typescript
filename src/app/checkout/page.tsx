import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutPage from "./CheckoutPage";

export default async function Checkout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("checkout_token");

  if (!token) {
    redirect("/shopping-bag");
  }

  return <CheckoutPage />;
}
