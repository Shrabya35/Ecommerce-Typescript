"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What brands do you offer?",
      answer:
        "We offer low-priced sportswear from top brands like adidas, Nike, PUMA, Reebok, Lonsdale, and Dunlop. Our selection includes comfortable shorts, breathable shoes, windproof tracksuit jackets, and much more. Our ever-growing range ensures you'll find your favorites at unbeatable prices.",
    },
    {
      question: "How do you offer such competitive prices?",
      answer:
        "LynxLine offers original, near-new products and licensed merchandise at unbeatable prices by purchasing remaining stock and discontinued items from top manufacturers. This allows us to pass significant savings directly to you without compromising on quality.",
    },
    {
      question: "What football equipment do you sell?",
      answer:
        "Our football shop has everything a fan could want—high-quality balls, boots for all surfaces, goalkeeper gear, and referee essentials. We also offer stylish, breathable, and durable sportswear to ensure you look and feel great, no matter the weather conditions.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! LynxLine offers worldwide shipping, so you can start saving on your favorite gear no matter where you're located. Check our shipping policy for more details on delivery times and costs for your specific region.",
    },
    {
      question: "How often do you update your inventory?",
      answer:
        "We regularly update our inventory with new deals and products. We recommend checking back often for unbeatable bargains and to find the latest additions to our collection of premium sportswear and equipment.",
    },
  ];

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
