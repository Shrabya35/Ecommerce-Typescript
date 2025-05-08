import { type NextPage } from "next";
import Link from "next/link";

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 bg-white text-black">
        <div className="tac-container max-w-4xl mx-auto">
          <div className="tac-title text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p className="mb-6">
              At LynxLine, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, and safeguard your information when you visit our
              website or make a purchase.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="font-bold text-xl mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-2">
                  We may collect the following types of information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Personal Information:</span>{" "}
                    Name, email address, postal address, phone number, and
                    payment information when you make a purchase.
                  </li>
                  <li>
                    <span className="font-medium">Account Information:</span>{" "}
                    Username, password, and purchase history when you create an
                    account.
                  </li>
                  <li>
                    <span className="font-medium">Usage Data:</span> Information
                    about how you interact with our website, including pages
                    visited, time spent, and browser type.
                  </li>
                  <li>
                    <span className="font-medium">
                      Cookies and Similar Technologies:
                    </span>{" "}
                    We use cookies to enhance your browsing experience and
                    analyze website traffic.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-2">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To process and fulfill your orders</li>
                  <li>To create and manage your account</li>
                  <li>To communicate with you about your orders and account</li>
                  <li>To send you marketing communications (if you opt in)</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  3. How We Share Your Information
                </h2>
                <p className="mb-2">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Service Providers:</span>{" "}
                    Companies that help us operate our business, such as payment
                    processors and shipping companies.
                  </li>
                  <li>
                    <span className="font-medium">Legal Authorities:</span> When
                    required by law or to protect our rights.
                  </li>
                </ul>
                <p className="mt-2">
                  We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">4. Your Rights</h2>
                <p className="mb-2">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Request transfer of your information</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact us using the
                  information provided below.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your
                  personal information. However, no method of transmission over
                  the internet or electronic storage is 100% secure, and we
                  cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">
                  6. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-xl mb-4">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
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

export default PrivacyPolicy;
