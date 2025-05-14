"use client";

import React, { useState, useEffect } from "react";
import { FaTruck, FaShieldAlt } from "react-icons/fa";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { IoIosRefresh } from "react-icons/io";
interface ValueHighlightProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ValueHighlight = ({ title, description, icon }: ValueHighlightProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex flex-col items-center p-5 transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center ">
        {title}
      </h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
};

const QuickValue = () => {
  const highlights = [
    {
      title: "Fast Shipping",
      description: "Free delivery on orders over ₹ 999",
      icon: <FaTruck className="w-8 h-8" />,
    },
    {
      title: "Quality Guaranteed",
      description: "100% satisfaction or money back",
      icon: <BiSolidBadgeCheck className="w-8 h-8" />,
    },
    {
      title: "Secure Payment",
      description: "Multiple payment methods accepted",
      icon: <FaShieldAlt className="w-8 h-8" />,
    },
    {
      title: "Easy Returns",
      description: "30-day hassle-free return policy",
      icon: <IoIosRefresh className="w-8 h-8" />,
    },
  ];

  return (
    <div className="w-full bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {highlights.map((item, index) => (
            <ValueHighlight
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickValue;
