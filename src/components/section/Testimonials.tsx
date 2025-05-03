"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/constants";
import clsx from "clsx";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  return (
    <div className="w-full py-20">
      <div className="max-w-screen-lg mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center mb-2">
          <div className="border-t border-gray-400 flex-grow mr-4 md:mr-6"></div>
          <h2 className="text-4xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight">
            Testimonials
          </h2>
          <div className="border-t border-gray-400 flex-grow ml-4 md:ml-6"></div>
        </div>
        <h3 className="text-xs text-center text-gray-700 font-extrabold mb-10 uppercase tracking-wider">
          What Our Athletes Say About LynxLine
        </h3>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className={clsx("transition-all duration-300 ease-in-out", {
                "transform -translate-x-full":
                  isAnimating && direction === "right",
                "transform translate-x-full":
                  isAnimating && direction === "left",
                "transform translate-x-0": !isAnimating,
              })}
            >
              <div className="w-full px-1">
                <div className="border rounded-xl bg-white transition-shadow duration-300 shadow-md p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonials[activeIndex].name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {testimonials[activeIndex].role}
                      </p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={clsx("w-4 h-4", {
                              "text-pink-500 fill-pink-500":
                                i < testimonials[activeIndex].rating,
                              "text-gray-300":
                                i >= testimonials[activeIndex].rating,
                            })}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-pink-500 font-semibold">
                        {testimonials[activeIndex].product}
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <div className="relative">
                        <div className="absolute -left-3 top-0 text-5xl text-pink-200 font-serif">
                          "
                        </div>
                        <p className="text-gray-600 italic pt-6 pl-3 relative z-10 text-base leading-relaxed">
                          {testimonials[activeIndex].content}
                        </p>
                        <div className="absolute -bottom-4 right-0 text-5xl text-pink-200 font-serif">
                          "
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx > activeIndex) {
                      setDirection("right");
                    } else if (idx < activeIndex) {
                      setDirection("left");
                    }
                    setIsAnimating(true);
                    setActiveIndex(idx);
                  }}
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300",
                    {
                      "bg-pink-500 w-6": idx === activeIndex,
                      "bg-gray-300 hover:bg-gray-400 w-2": idx !== activeIndex,
                    }
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
