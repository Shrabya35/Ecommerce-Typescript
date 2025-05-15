import { Metadata } from "next";
import { type NextPage } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | LynxLine",
  description:
    "Have questions or need support? Get in touch with the LynxLine team — we're here to help.",
};

const Contact: NextPage = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 bg-white text-black">
        <section className="mb-16">
          <div className="tac-title text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-500">Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body max-w-4xl mx-auto">
            <p className="mb-6">
              We always strive to make your experience with LynxLine as seamless
              and enjoyable as possible. While we may not have a clickable chat
              button like some other websites, our contact process is designed
              to be just as straightforward and efficient, ensuring you can
              easily reach us whenever you need assistance.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">Get In Touch</h2>

            <div className="space-y-8">
              <div className="pb-6 border-b border-gray-200">
                <h3 className="font-bold text-lg mb-3">Career Enquiries:</h3>
                <p className="mb-3">
                  Are you interested in joining the LynxLine team? We are always
                  on the lookout for talented and passionate individuals who
                  want to make a difference. Whether you're looking to start a
                  career in the fitness industry or bring your expertise to our
                  growing company, we'd love to hear from you. For all
                  career-related enquiries, please email us at:
                </p>
                <Link
                  href="mailto:career@lynxline.com"
                  className="font-medium hover:underline"
                >
                  career@lynxline.com
                </Link>
              </div>

              <div className="pb-6 border-b border-gray-200">
                <h3 className="font-bold text-lg mb-3">
                  General Business Enquiries:
                </h3>
                <p className="mb-3">
                  Do you have a business proposal, partnership opportunity, or
                  any other general business-related questions? We value your
                  interest and are eager to explore potential collaborations
                  that align with our mission and values. For all general
                  business enquiries, please email us at:
                </p>
                <Link
                  href="mailto:business@lynxline.com"
                  className="font-medium hover:underline"
                >
                  business@lynxline.com
                </Link>
              </div>

              <div className="pb-6 border-b border-gray-200">
                <h3 className="font-bold text-lg mb-3">Customer Support:</h3>
                <p className="mb-3">
                  If you need assistance with an order, have a question about
                  our products, or require any other customer service support,
                  please do not hesitate to reach out. Our customer service team
                  is dedicated to providing you with the help you need in a
                  timely and effective manner. You can reach our customer
                  support team by emailing:
                </p>
                <Link
                  href="mailto:support@lynxline.com"
                  className="font-medium hover:underline"
                >
                  support@lynxline.com
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              HOW TO CONTACT LYNXLINE BY EMAIL?
            </h2>
            <div className="space-y-4">
              <p>
                If you'd prefer to email us, please send your email to{" "}
                <Link
                  href="mailto:support@lynxline.com"
                  className="font-medium hover:underline"
                >
                  support@lynxline.com
                </Link>
                . We typically aim to get back to you within 24-48 hours.
              </p>

              <p>
                To help us assist you as quickly as possible, please include the
                following information in your email:
              </p>

              <ul className="space-y-2 list-disc pl-5">
                <li>Order number (eg. #123456)</li>
                <li>Your email address</li>
                <li>A detailed description of your issue</li>
                <li>Supporting images (if applicable)</li>
              </ul>

              <p>
                Providing this information will allow us to answer your
                questions efficiently. You can expect a reply within 24 hours,
                except during busy sale periods, when it may take slightly
                longer.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Our Locations</h2>
            <div className="space-y-4">
              <p>
                While most of our customer support is handled online, we do have
                physical offices in several locations around the world:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-bold">Headquarters:</h4>
                  <p>Biratnagar, Nepal</p>
                </div>

                <div>
                  <h4 className="font-bold">European Office:</h4>
                  <p>Cardiff, Wales</p>
                </div>

                <div>
                  <h4 className="font-bold">Asian Office:</h4>
                  <p>Thimphu, Bhutan</p>
                </div>

                <div>
                  <h4 className="font-bold">Other Locations:</h4>
                  <p>Brazil & Cyprus</p>
                </div>
              </div>

              <p className="mt-4">
                Please note that these offices primarily serve our business
                operations. For the fastest response to customer inquiries, we
                recommend contacting us via email at{" "}
                <Link
                  href="mailto:support@lynxline.com"
                  className="font-medium hover:underline"
                >
                  support@lynxline.com
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
