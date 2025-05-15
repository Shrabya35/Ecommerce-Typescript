"use client";

import { formatNumberNPR } from "@/utils/formatNumberNpr";
import Link from "next/link";
import React from "react";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  description?: string;
  category?: string | { name: string };
  type?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice =
    product.discount && product.discount > 0
      ? (product.price - (product.price * product.discount) / 100).toFixed(2)
      : null;

  const shortDescription =
    product.description && product.description.length > 80
      ? `${product.description.substring(0, 80)}...`
      : product.description;

  const getCategoryName = () => {
    if (typeof product.category === "string") {
      return product.category;
    }
    return product.category?.name || product.type || "Unknown";
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="product-card flex-shrink-0 w-64 sm:w-80 h-90 border border-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 bg-white flex flex-col">
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
                {discountedPrice ? (
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-pink-500 line-through">
                      ₹ {formatNumberNPR(product.price)}
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      ₹ {formatNumberNPR(Number(discountedPrice))}
                    </p>
                  </div>
                ) : (
                  <p className="text-base font-bold text-gray-900">
                    ₹ {formatNumberNPR(product.price)}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-full truncate max-w-28">
                {getCategoryName()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
