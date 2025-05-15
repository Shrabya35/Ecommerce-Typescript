import { Metadata } from "next";
import { type NextPage } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Guide | LynxLine",
  description:
    "Learn how to place, track, and manage your orders with ease. Your step-by-step shopping guide at LynxLine.",
};

const OrderGuide: NextPage = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 bg-white text-black">
        <div className="tac-container max-w-4xl mx-auto">
          <div className="tac-title text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Order Guide</h1>
            <p className="text-gray-500">Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p className="mb-6">
              Placing an order on LynxLine is quick and easy. Follow these steps
              to ensure a smooth shopping experience:
            </p>

            <div className="space-y-6">
              <div>
                <h2 className="font-bold text-xl mb-4">
                  1. Browse and Search for Products:
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Explore our website by scrolling through the various
                    categories or using the search bar to find specific items.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  2. Select and Add to Cart:
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click on the product you love to view its details.</li>
                  <li>
                    Click "Add to Bag" to include the item in your shopping bag.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">3. Review Your Cart:</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Go to the cart section by clicking on the cart icon.</li>
                  <li>Set the quantity you want to buy for each item.</li>
                  <li>
                    Ensure all selected items are correct before proceeding.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">4. Checkout Process:</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click "Checkout" to proceed with your purchase.</li>
                  <li>
                    Fill in all required fields, including shipping information
                    and payment details.
                  </li>
                  <li>Review your order summary and submit your order.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  5. Order Confirmation:
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    After completing your purchase, you will receive an order
                    confirmation email.
                  </li>
                  <li>
                    This email will contain your order details and tracking
                    information.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">6. Track Your Order:</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Proceed in to your profile to track the status of your
                    order.
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-8">
              By following these steps, you can enjoy a hassle-free shopping
              experience on LynxLine. If you have any questions or need further
              assistance, please do not hesitate to contact our support team at{" "}
              <Link
                href="mailto:support@lynxline.com"
                className="font-medium hover:underline"
              >
                support@lynxline.com
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderGuide;
