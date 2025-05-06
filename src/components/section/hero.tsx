"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title1: string;
  title2: string;
  description: string;
  Images: { src: string }[];
  link1: { href: string; title: string }[];
  link2: { href: string; title: string }[];
}

const Hero = ({
  title1,
  title2,
  description,
  Images,
  link1,
  link2,
}: HeroProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % Images.length);
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [Images.length]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);

    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Images.length);
    }, 5000);
  };

  return (
    <main className="flex w-full items-center relative overflow-hidden min-h-screen">
      <div className="w-full py-8 md:py-12 relative">
        <div className="container mx-auto px-4 md:px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-2/5 flex flex-col relative z-20 text-center lg:text-left">
            <span
              className={`w-20 h-2 bg-gray-800 mb-6 mx-auto lg:mx-0 transition-all duration-700 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            ></span>

            <h1 className="font-bebas-neue uppercase text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {title1}
              </span>
              <span
                className={`text-3xl sm:text-4xl lg:text-5xl text-pink-500 block transition-all duration-700 delay-300 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {title2}
              </span>
            </h1>

            <p
              className={`text-base sm:text-lg text-gray-700 mt-4 transition-all duration-700 delay-500 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {description}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start mt-8 gap-4">
              {link1 &&
                link1.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`transition-all duration-700 ${
                      mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${700 + index * 150}ms` }}
                  >
                    <div className="uppercase py-2 px-4 md:py-3 md:px-6 rounded-lg bg-pink-500 border-2 border-transparent text-white text-base md:text-lg hover:bg-pink-400 transition duration-300">
                      {link.title}
                    </div>
                  </Link>
                ))}
              {link2 &&
                link2.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`transition-all duration-700 ${
                      mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${
                        700 + ((link1?.length || 0) + index) * 150
                      }ms`,
                    }}
                  >
                    <div className="uppercase py-2 px-4 md:py-3 md:px-6 rounded-lg bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white text-base md:text-lg transition duration-300">
                      {link.title}
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="w-full lg:w-3/5 flex justify-center items-center relative">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <div className="relative aspect-[4/3] overflow-hidden transition-transform duration-700 ease-out">
                {Images &&
                  Images.length > 0 &&
                  Images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                        activeIndex === index
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      } ${mounted ? "translate-y-0" : "translate-y-8"}`}
                      style={{
                        transitionDelay: mounted ? `${index * 200}ms` : "0ms",
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={`Product Image ${index + 1}`}
                        fill
                        className="object-contain object-center shadow-lg shadow-gray-300 rounded-lg"
                        priority={index === 0}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {Images && Images.length > 1 && (
          <div className="absolute right-4 md:right-6 lg:right-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-30">
            {Images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-pink-500"
                    : "bg-gray-400 hover:bg-pink-300"
                } ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
                style={{
                  transitionDelay: mounted ? `${800 + index * 150}ms` : "0ms",
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Hero;
