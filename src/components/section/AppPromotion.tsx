"use client";

import React from "react";
import { FaApple, FaGooglePlay, Shield, Zap, Tag } from "@/components/icons";
import { AppMockup } from "@/assets";

const AppPromotionalSection = () => {
  return (
    <div className="w-full py-20 bg-white">
      <div className="max-w-screen-lg mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center mb-2">
          <div className="border-t border-gray-400 flex-grow mr-4 md:mr-6"></div>
          <h2 className="text-4xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight">
            Get The App
          </h2>
          <div className="border-t border-gray-400 flex-grow ml-4 md:ml-6"></div>
        </div>
        <h3 className="text-xs text-center text-gray-700 font-extrabold mb-10 uppercase tracking-wider">
          Shop Smarter With The LynxLine Mobile Experience
        </h3>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-[500px] bg-gray-900 rounded-[40px] p-3 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl"></div>

                <div className="w-full h-full bg-pink-50 rounded-[32px] overflow-hidden relative">
                  <img
                    src={AppMockup.src}
                    alt="App Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute -z-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 -bottom-20 -right-20"></div>
              <div className="absolute -z-10 w-40 h-40 bg-pink-300 rounded-full blur-2xl opacity-20 -top-10 -left-10"></div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h4 className="text-2xl font-bold mb-6 text-gray-900">
              Experience LynxLine On The Go
            </h4>
            <p className="text-gray-600 mb-8">
              Download our mobile app to enhance your shopping experience with
              exclusive deals, faster checkout, and personalized recommendations
              tailored to your athletic needs.
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex items-start">
                <div className="p-3 bg-pink-50 rounded-xl mr-4">
                  <Zap className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">
                    Exclusive App Deals
                  </h5>
                  <p className="text-gray-600 text-sm">
                    Get access to app-only discounts and early access to new
                    collections.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 bg-pink-50 rounded-xl mr-4">
                  <Shield className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">
                    Secure Checkout
                  </h5>
                  <p className="text-gray-600 text-sm">
                    Save your payment details securely for faster shopping
                    experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 bg-pink-50 rounded-xl mr-4">
                  <Tag className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">
                    Personalized Recommendations
                  </h5>
                  <p className="text-gray-600 text-sm">
                    Discover products that match your athletic preferences and
                    history.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="mr-3">
                  <FaApple className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="mr-3">
                  <FaGooglePlay className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPromotionalSection;
