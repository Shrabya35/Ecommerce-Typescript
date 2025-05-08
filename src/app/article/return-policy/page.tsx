import { type NextPage } from "next";
import Link from "next/link";

const ReturnPolicy: NextPage = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 bg-white text-black">
        <div className="tac-container max-w-4xl mx-auto">
          <div className="tac-title text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Return Policy</h1>
            <p className="text-gray-500">Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p className="mb-6">
              At LynxLine, we strive to ensure your complete satisfaction with
              every purchase. If you are not entirely satisfied with your
              purchase, we're here to help.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="font-bold text-xl mb-4">
                  1. Return Eligibility
                </h2>
                <p className="mb-2">
                  Returns are accepted only under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Returns can only be made at our offline stores or our branch
                    headquarters.
                  </li>
                  <li>
                    The return must be initiated within 7 days of delivery.
                  </li>
                  <li>
                    The product must be in its original condition, without any
                    damage or signs of wear and tear.
                  </li>
                  <li>Returns due to a change of mind will not be accepted.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  2. Valid Reasons for Returns
                </h2>
                <p className="mb-2">
                  Returns will only be accepted for the following valid reasons:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    If you received a different product than what you ordered.
                  </li>
                  <li>If the product arrived damaged or defective.</li>
                  <li>
                    If there are any other substantial issues with the order.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">3. Return Process</h2>
                <p className="mb-2">
                  To initiate a return, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Visit one of our offline stores or our branch headquarters
                    with the product and proof of purchase.
                  </li>
                  <li>Explain the reason for the return to our staff.</li>
                  <li>
                    Our team will inspect the product to ensure it meets the
                    return criteria.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">4. Refunds</h2>
                <p>
                  Once your return is approved, we will process your refund.
                  Refunds will be issued to the original method of payment.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">Contact</h2>
                <p>
                  If you have any questions about these Return Policies, please
                  contact us at{" "}
                  <Link
                    href="mailto:support@lynxline.com"
                    className="font-medium hover:underline"
                  >
                    support@lynxline.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ReturnPolicy;
