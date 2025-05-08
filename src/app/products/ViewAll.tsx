"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { NoProduct } from "@/assets";
import { ClipLoader } from "react-spinners";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  discountedPrice?: number;
  category?: { name: string } | string;
  type: string;
  slug: string;
  onSale?: boolean;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
}

const ViewAllPage = () => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 15;
  const [pageTitle, setPageTitle] = useState("All Products");

  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const onSale = searchParams.get("onSale");
  const sort = searchParams.get("sort");
  const price = searchParams.get("price");

  useEffect(() => {
    let title = "All Products";

    if (onSale === "true") {
      title = "On Sale Items";
    } else if (category) {
      title = `${category} Products`;
    } else if (type) {
      title = `All ${type} Products`;
    } else if (sort) {
      const sortMap: Record<string, string> = {
        "price-asc": "Price: Low to High",
        "price-desc": "Price: High to Low",
        newest: "Newest Arrivals",
        popular: "Most Popular",
      };
      title = `Products ${sortMap[sort] || `Sorted by ${sort}`}`;
    } else if (price) {
      title = `Price Range: ${price}`;
    }

    setPageTitle(title);
  }, [category, type, onSale, sort, price]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category, type, onSale, sort, price, page, limit],
    queryFn: async () => {
      let queryUrl = `/api/product?page=${page}&limit=${limit}`;

      if (category) queryUrl += `&category=${encodeURIComponent(category)}`;
      if (type) queryUrl += `&type=${encodeURIComponent(type)}`;
      if (onSale) queryUrl += `&onSale=${onSale}`;
      if (sort) queryUrl += `&sort=${encodeURIComponent(sort)}`;
      if (price) queryUrl += `&price=${encodeURIComponent(price)}`;

      const response = await axios.get(queryUrl, { withCredentials: true });
      return response.data as ProductsResponse;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.products || [];
  const totalPages = data?.pages || 0;
  const totalResults = data?.total || 0;

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const truncateDescription = (description: string) => {
    if (description.length > 120) {
      return description.substring(0, 120) + "...";
    }
    return description;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={40} color="#E91E63" />
        <span className="ml-2 text-xl font-medium">Loading products...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-600">
            Error loading products
          </h2>
          <p className="mt-2 text-red-500">Please try again later.</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-6">
        <div className="flex items-baseline gap-2 mt-1">
          <h1 className="text-lg sm:text-2xl font-semibold text-neutral-900">
            {pageTitle}
          </h1>
          <span className="text-xs text-neutral-500">
            {totalResults} products
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoProduct}
            className="w-40 h-40 object-cover"
            alt="no products"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            No products found
          </h1>
          <p className="mt-2 text-gray-600">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => {
              const shortDescription = product.description
                ? truncateDescription(product.description)
                : "";

              return (
                <Link
                  href={`/products/${product.slug}`}
                  key={product._id}
                  className="group"
                >
                  <div className="product-card flex-shrink-0 w-40 sm:w-80 h-70 sm:h-90 border border-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 bg-white flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={`/api/product/photo/${product._id}`}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={product.name}
                        loading="lazy"
                      />
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col p-5 flex-grow">
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-lg text-gray-800 font-semibold line-clamp-1 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {shortDescription}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <div>
                            {product.discount ? (
                              <div className="flex gap-2 items-center">
                                <p className="text-xs text-pink-500 line-through">
                                  ${product.price}
                                </p>
                                <p className="text-base font-bold text-gray-900">
                                  ${product.discountedPrice}
                                </p>
                              </div>
                            ) : (
                              <p className="text-base font-bold text-gray-900">
                                ${product.price}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-full truncate max-w-28">
                            {typeof product.category === "object" &&
                            product.category?.name
                              ? product.category.name
                              : product.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div className="flex flex-wrap items-center gap-2 px-2 py-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-200 ${
                    page <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-pink-500 hover:bg-pink-400 hover:text-white shadow-sm border border-gray-200"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  <span className="font-medium">Prev</span>
                </button>

                <div className="hidden sm:flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-full mx-1 font-medium cursor-pointer ${
                          page === pageNum
                            ? "bg-pink-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-pink-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <div className="px-4 py-2 font-medium text-gray-700 sm:hidden">
                  {page} / {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                    page >= totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-pink-500 hover:bg-pink-400 hover:text-white shadow-sm border border-gray-200"
                  }`}
                  aria-label="Next page"
                >
                  <span className="font-medium">Next</span>
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewAllPage;
