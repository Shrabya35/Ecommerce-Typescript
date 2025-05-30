"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../ui/cards/ProductCard";
import { IProduct } from "@/interface";

interface ProductCarouselProps {
  title: string;
  products: IProduct[];
  className?: string;
}

const staticProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  products,
  className = "",
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScrollPosition);
      setTimeout(checkScrollPosition, 100);
      return () => slider.removeEventListener("scroll", checkScrollPosition);
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener("resize", handleResize);
    if (products?.length) {
      setTimeout(checkScrollPosition, 100);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [products]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  const containerClasses = `w-full bg-white py-10 max-w-full px-4 md:px-6 lg:px-8 ${className}`;

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <h2 className="text-xl text-gray-800 md:text-2xl font-bold mb-6">
        {title}
      </h2>

      <div className="relative w-full max-w-full overflow-hidden">
        {canScrollLeft && (
          <button
            onClick={slideLeft}
            className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div
          ref={sliderRef}
          className="product-slider overflow-x-auto flex gap-5 py-4 px-1 scrollbar-hide scroll-smooth pb-6 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={checkScrollPosition}
        >
          {products.map((product: IProduct) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={slideRight}
            className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default staticProductCarousel;
