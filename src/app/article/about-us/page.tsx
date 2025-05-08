import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { About1, About2, About3 } from "@/assets";

const About: NextPage = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 bg-white text-black">
        <section className="grid md:grid-cols-2 gap-12 mb-30 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About Us</h2>
            <div className="space-y-4">
              <p>
                We are LynxLine. Our mission is to bring together the
                conditioning* community.
              </p>
              <p>
                It's not the goals that unite us, but the shared journey to
                achieve them. Despite our varied training environments and
                ultimate objectives, the dedication and effort we put in is what
                binds us. We are a collective of individuals who believe that we
                can achieve more together than alone.
              </p>
              <p>
                Our story began in 2023, in a small garage in Biratnagar, Nepal,
                armed with just a sewing machine, a screen printer, and dreams
                that seemed too big. Today, we design the gear that helps
                everyone strive for their best: the clothing you'll wear through
                every workout, the content that inspires you, and the community
                where you can thrive.
              </p>
              <p>
                Our LynxLine family is small but growing, with our first few
                hundred customers already supporting us through our initial
                online store. As we continue to expand, we are building our team
                and establishing our first offices, starting locally and aiming
                to grow globally. Our team of over 3 employees spans five
                countries, including offices in Nepal, Wales, Bhutan, Brazil,
                and Cyprus.
              </p>
              <p className="font-semibold">
                *Conditioning encompasses all the efforts we make today to be
                ready for tomorrow.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-3">LynxLine IS LED BY:</h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold">Shrabya</span> - Founder & Chief
                  Executive Officer
                </li>
                <li>
                  <span className="font-bold">Binod</span> - Chief Financial
                  Officer
                </li>
                <li>
                  <span className="font-bold">Banrakas</span> - Chief Brand
                  Officer
                </li>
              </ul>
            </div>
          </div>

          <div className="relative h-96 bg-gray-100">
            <Image
              src={About1.src}
              alt="LynxLine team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-12 mb-30 items-center">
          <div className="order-2 md:order-1 relative h-96 bg-gray-100">
            <Image
              src={About2.src}
              alt="LynxLine values"
              fill
              className="object-cover"
            />
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl font-bold">Our Core Values</h2>
            <div className="space-y-4">
              <p>
                Our principles are priceless. Losing them means losing our
                foundation.
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-lg text-pink-500">
                  STAY AUTHENTIC.
                </h4>
                <p>
                  At LynxLine, being approachable, inclusive, and modest is in
                  our DNA.
                </p>

                <h4 className="font-bold text-lg text-pink-500">
                  CARE DEEPLY.
                </h4>
                <p>
                  We prioritize awareness of our environment, support those
                  around us, and take proactive steps to foster positive change.
                </p>

                <h4 className="font-bold text-lg text-pink-500">
                  ACT WITH INTEGRITY.
                </h4>
                <p>
                  You can rely on us to be honest, trustworthy, and sincere.
                </p>

                <h4 className="font-bold text-lg text-pink-500">
                  EMBRACE THE LynxLine SPIRIT.
                </h4>
                <p>
                  Never forget the drive and mindset that started in our garage:
                  ambitious, flexible, and innovative.
                </p>

                <h4 className="font-bold text-lg text-pink-500">
                  PRIORITIZE FAMILY.
                </h4>
                <p>Always and without exception.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <div className="space-y-4">
              <p>
                For Career enquiries please email:
                <br />
                <Link
                  href="mailto:career@lynxline.com"
                  className="text-pink-500 hover:underline font-medium"
                >
                  career@lynxline.com
                </Link>
              </p>

              <p>
                For General Business enquiries please email:
                <br />
                <Link
                  href="mailto:business@lynxline.com"
                  className="text-pink-500 hover:underline font-medium"
                >
                  business@lynxline.com
                </Link>
              </p>

              <p>
                For all customer service enquiries please{" "}
                <Link
                  href="/contact"
                  className="text-pink-500 hover:underline font-medium"
                >
                  Contact Us
                </Link>
              </p>
            </div>
          </div>

          <div className="relative h-96 bg-gray-100">
            <Image
              src={About3.src}
              alt="Get in touch"
              fill
              className="object-cover"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
