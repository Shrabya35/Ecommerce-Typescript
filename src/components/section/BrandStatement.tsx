"use client";

import React, { useEffect, useState, useRef } from "react";

const BrandStatement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    if (containerRef.current) {
      const container = containerRef.current;
      for (let i = 0; i < 15; i++) {
        createParticle(container);
      }
    }
  }, []);

  const createParticle = (container: HTMLDivElement) => {
    const particle = document.createElement("div");

    const size = Math.random() * 3 + 2;

    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;

    const duration = Math.random() * 10 + 8;

    particle.style.position = "absolute";
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = "rgba(236, 72, 153, 0.4)";
    particle.style.borderRadius = "50%";
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
    particle.style.filter = "blur(1px)";
    particle.style.boxShadow = "0 0 4px rgba(236, 72, 153, 0.5)";

    particle.style.animation = `float ${duration}s ease-in-out infinite`;
    particle.style.opacity = (Math.random() * 0.3 + 0.2).toString();

    container.appendChild(particle);
  };

  return (
    <div
      className="relative w-full py-16 px-8 flex items-center justify-center bg-black overflow-hidden"
      style={{ height: "400px" }}
    >
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
      ></div>

      <div className="absolute inset-4 border border-pink-500/20"></div>

      <div className="relative z-10 max-w-xl mx-auto">
        <div
          className={`text-center transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold tracking-wider mb-2 text-white">
            Unleash Your <span className="text-pink-500">Inner Beast</span>
          </h1>

          <h2 className="text-3xl font-light tracking-wide mb-8 text-white">
            With LynxLine
          </h2>

          <div className="w-16 h-px mx-auto mb-8 bg-pink-500"></div>

          <div
            className={`relative transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-lg leading-relaxed text-gray-300 mb-10">
              By looking to the world's greatest innovator—
              <span className="font-medium text-pink-300">Nature</span>—we’ve
              designed LynxLine to fuse raw instinct with human performance.
            </p>

            <div className="mt-8 text-sm tracking-widest text-pink-300 font-light">
              LynxLine Co.™
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-pink-500/50"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-pink-500/50"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-pink-500/50"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-pink-500/50"></div>
    </div>
  );
};

export default BrandStatement;
