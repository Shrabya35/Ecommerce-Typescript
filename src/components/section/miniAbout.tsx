"use client";

import React from "react";

const MiniAbout = () => {
  return (
    <div className="w-full py-16 ">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center mb-2">
          <div className="border-t border-gray-400 flex-grow mr-4 md:mr-6"></div>
          <h2 className="text-4xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight">
            Welcome to LynxLine.com
          </h2>
          <div className="border-t border-gray-400 flex-grow ml-4 md:ml-6"></div>
        </div>
        <h3 className="text-xs text-center text-gray-700 font-extrabold  mb-10 uppercase tracking-wider">
          Your Online Shop for Low-Priced Branded Sportswear and Sporting Goods
        </h3>

        <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
          <div className=" p-6 ">
            <p className="font-semibold text-gray-800 md:text-center">
              First-class materials and innovative technologies
            </p>
            <p className="mt-1">
              Quality doesn’t have to be expensive! As sports enthusiasts
              ourselves, we understand the value of high-quality equipment.
              That’s why we offer low-priced sportswear from top brands like
              adidas, Nike, PUMA, Reebok, Lonsdale, and Dunlop. From comfortable
              shorts to breathable shoes and windproof tracksuit jackets, our
              ever-growing range ensures you’ll find your favorites. Check back
              often for unbeatable bargains!
            </p>
          </div>

          <div className="p-6">
            <p className="font-semibold text-gray-800 md:text-center">
              For Football Fans and Sporting Aces
            </p>
            <p className="mt-2">
              Passionate about football? So are we! Our football shop has
              everything a fan could want—high-quality balls, boots for all
              surfaces, goalkeeper gear, and referee essentials. Plus, our
              stylish, breathable, and durable sportswear ensures you look and
              feel great, no matter the weather. LynxLine delivers affordable
              options tailored to your active lifestyle.
            </p>
          </div>

          <div className=" p-6 ">
            <p className="font-semibold text-gray-800 md:text-center">
              Score Now and Get Your Benefits!
            </p>
            <p className="mt-2 ">
              LynxLine offers original, near-new products and licensed
              merchandise—like cheap soccer jerseys—at unbeatable prices. How?
              We snap up remaining stock and discontinued items from top
              manufacturers. With worldwide shipping, you can start saving on
              your favorite gear today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniAbout;
