import Image from "next/image";
import Link from "next/link";
import { Esewa, Khalti, QrCode } from "@/assets";
import { Tooltip } from "antd";

import {
  FaDiscord,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div>
            <h3 className="text-lg font-bold mb-4">LynxLine</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition"
                >
                  About LynxLine
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-black transition"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/men"
                  className="text-gray-700 hover:text-black transition"
                >
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/women"
                  className="text-gray-700 hover:text-black transition"
                >
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-gray-700 hover:text-black transition"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Help & Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-black transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-700 hover:text-black transition"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-black transition"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/reset-password"
                  className="text-gray-700 hover:text-black transition"
                >
                  Reset Password
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/forgot-password"
                  className="text-gray-700 hover:text-black transition"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

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
                />
                <p className="text-xs text-center mt-2">
                  Scan for exclusive offers
                </p>
              </div>

              <div className="flex justify-center flex-wrap gap-3 mt-2">
                <a
                  href="/"
                  aria-label="Discord"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaDiscord size={16} />
                </a>
                <a
                  href="/"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="/"
                  aria-label="YouTube"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaYoutube size={16} />
                </a>
                <a
                  href="/"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="/"
                  aria-label="Twitter"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaTwitter size={16} />
                </a>
                <a
                  href="/"
                  aria-label="TikTok"
                  className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
                >
                  <FaTiktok size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 border-t border-gray-200 flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">LynxLine Global</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { code: "NP", label: "Nepal" },
                { code: "AO", label: "Angola" },
                { code: "KI", label: "Kiribati" },
                { code: "UG", label: "Uganda" },
                { code: "CY", label: "Cyprus" },
              ].map((country) => (
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
                      className="rounded"
                    />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 py-6 md:border-none md:py-0">
            <p className="text-lg font-bold mb-2">Secure payment options:</p>
            <div className="flex space-x-4">
              <div className="  ">
                <Tooltip title="Esewa">
                  <Image
                    src={Esewa}
                    alt="Esewa"
                    width={48}
                    height={40}
                    className="object-contain"
                  />
                </Tooltip>
              </div>
              <div className=" ">
                <Tooltip title="Khalti">
                  <Image
                    src={Khalti}
                    alt="Khalti"
                    width={48}
                    height={40}
                    className="object-contain"
                  />
                </Tooltip>
              </div>
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
