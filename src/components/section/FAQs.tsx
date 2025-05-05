"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/constants";
import clsx from "clsx";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full py-20 ">
      <div className="max-w-screen-lg mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center mb-2">
          <div className="border-t border-gray-400 flex-grow mr-4 md:mr-6"></div>
          <h2 className="text-4xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight">
            FAQs
          </h2>
          <div className="border-t border-gray-400 flex-grow ml-4 md:ml-6"></div>
        </div>
        <h3 className="text-xs text-center text-gray-700 font-extrabold mb-10 uppercase tracking-wider">
          Everything You Need to Know About LynxLine.com
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={clsx(
                  "border rounded-xl transition-shadow duration-300 bg-white",
                  {
                    "shadow-md": isOpen,
                  }
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full px-6 py-5 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={clsx(
                      "h-5 w-5 text-gray-500 transition-transform duration-300",
                      { "rotate-180": isOpen }
                    )}
                  />
                </button>
                <div
                  className={clsx(
                    "px-6 overflow-hidden transition-all duration-300 text-gray-600",
                    {
                      "max-h-0 opacity-0": !isOpen,
                      "max-h-[500px] opacity-100 pb-5": isOpen,
                    }
                  )}
                >
                  <p className="text-base leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
