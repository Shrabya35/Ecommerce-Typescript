"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../ui/cards/ProductCard";

import { useLoading } from "@/context/loadingContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category?: { name: string } | string;
  type: string;
  slug: string;
}

interface ProductCarouselProps {
  title: string;
  queryType?: "category" | "type";
  query?: string;
  onSale?: boolean;
  sort?: "latest" | "oldest";
  price?: "high" | "low";
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
  similarProduct?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  queryType,
  query,
  onSale,
  sort,
  price,
  similarProduct,
  className = "",
}) => {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { setLoading } = useLoading();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", queryType, query, onSale, sort, price],
    queryFn: async () => {
      let queryUrl = `/api/product?page=1&limit=9`;

      if (queryType === "category" && query) {
        queryUrl += `&category=${query}`;
      } else if (queryType === "type" && query) {
        queryUrl += `&type=${query}`;
      }

      if (onSale !== undefined) {
        queryUrl += `&onSale=${onSale}`;
      }

      if (sort) {
        queryUrl += `&sort=${sort}`;
      }

      if (price) {
        queryUrl += `&price=${price}`;
      }

      const response = await axios.get(queryUrl, { withCredentials: true });
      return response.data.products;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

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

  const handleViewAll = () => {
    const params = new URLSearchParams();

    if (queryType === "category" && query) {
      params.set("category", query);
    } else if (queryType === "type" && query) {
      params.set("type", query);
    }

    if (onSale !== undefined) {
      params.set("onSale", String(onSale));
    }

    if (sort) {
      params.set("sort", sort);
    }

    if (price) {
      params.set("price", price);
    }

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const containerClasses = `w-full bg-white py-10 max-w-full px-4 md:px-6 lg:px-8 ${className}`;

  if (error)
    return (
      <div className={containerClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 md:text-2xl font-bold">
            {title}
          </h2>
          <button className="hover:underline text-gray-800 cursor-pointer font-medium text-sm md:text-base transition-colors">
            View All
          </button>
        </div>
        <div className="py-8 text-center text-red-500">
          Error: {(error as Error).message}
        </div>
      </div>
    );

  if (!products || products.length === 0) {
    return null;
  }

  const filteredProducts = similarProduct
    ? products.filter((product: Product) => product._id !== similarProduct)
    : products;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-gray-800 md:text-2xl font-bold">{title}</h2>
        <button
          className="hover:underline text-gray-800 cursor-pointer font-medium text-sm md:text-base transition-colors"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

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
          {filteredProducts.map((product: Product) => {
            return <ProductCard key={product._id} product={product} />;
          })}
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

export default ProductCarousel;
