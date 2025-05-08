import Image from "next/image";
import Link from "next/link";
import { QrCode } from "@/assets";
import { footerLinks, paymentOptions, countries } from "@/constants";
import { Tooltip } from "antd";

import {
  FaDiscord,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from "@/components/icons";

const footerSocialLinks = [
  { icon: FaDiscord, label: "Discord", href: "/" },
  { icon: FaFacebookF, label: "Facebook", href: "/" },
  { icon: FaYoutube, label: "YouTube", href: "/" },
  { icon: FaInstagram, label: "Instagram", href: "/" },
  { icon: FaTwitter, label: "Twitter", href: "/" },
  { icon: FaTiktok, label: "TikTok", href: "/" },
];

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold mb-4">{section.title}</h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-black transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg inline-block">
                <Image
                  src={QrCode}
                  alt="QR Code"
                  width={100}
                  height={100}
                  className="mx-auto"
                  priority
                />
                <p className="text-xs text-center mt-2">
                  Scan for exclusive offers
                </p>
              </div>

              <div className="flex justify-center flex-wrap gap-3 mt-2">
                {footerSocialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-gray-200 flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">LynxLine Global</h3>
            <div className="flex flex-wrap gap-4">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center space-x-2 rounded-md"
                >
                  <Tooltip title={country.label}>
                    <Image
                      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`}
                      alt={`${country.label} Flag`}
                      width={30}
                      height={25}
                      className="rounded w-8 h-8"
                    />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 py-6 md:border-none md:py-0">
            <p className="text-lg font-bold mb-2">Secure payment options:</p>
            <div className="flex space-x-4">
              {paymentOptions.map((payment, index) => (
                <div key={`${payment.label}-${index}`}>
                  <Tooltip title={payment.label}>
                    <Image
                      src={payment.image}
                      alt={payment.label}
                      width={0}
                      height={0}
                      sizes="100%"
                      className="w-12 h-auto object-contain"
                      style={{ width: "48px", height: "auto" }}
                    />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} LynxLine | All rights reserved.
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-1 tracking-wide">
            Unleash Your Inner Beast.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
