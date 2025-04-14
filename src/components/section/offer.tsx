"use client";

import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { offers } from "@/constants";

const Offer = () => {
  const [offerIndex, setOfferIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full bg-neutral-900 text-white text-sm py-2 px-8 flex items-center justify-center text-center relative transition-all duration-300 ease-in-out">
      <span className="opacity-90">{offers[offerIndex]}</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
      >
        <IoMdClose className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  );
};

export default Offer;
