"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title1: string;
  title2: string;
  description: string;
  ImageSrc: string;
  link1: { href: string; title: string }[];
  link2: { href: string; title: string }[];
}

const Hero = ({
  title1,
  title2,
  description,
  ImageSrc,
  link1,
  link2,
}: HeroProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex w-full items-center bg-gray-200 relative overflow-hidden min-h-screen">
      <div className="w-full bg-gray-200 py-8 md:py-12">
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

          <div className="w-full lg:w-3/5 flex justify-center items-center">
            {ImageSrc && (
              <div
                className={`relative w-full max-w-lg transition-all duration-1000 ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
              >
                <Image
                  src={ImageSrc}
                  alt="Hero Banner"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
