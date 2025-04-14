"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "@/redux/slices/productSlice";
import Link from "next/link";
import Image from "next/image";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";

interface Product {
  _id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
  category: string | { name: string; _id: string; __v?: number };
  quantity: number;
  image?: {
    data: string;
    contentType: string;
  };
  shipping?: boolean;
}

const ProductsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, total, totalPages, page, limit } = useSelector(
    (state: RootState) => state.product
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchProduct({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage: number): void => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getCategoryName = (
    category: string | { name: string; _id: string; __v?: number }
  ): string => {
    if (typeof category === "string") {
      return category;
    }
    return category?.name || "Uncategorized";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Image
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Stock
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product: Product) => (
                    <tr key={product._id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 overflow-hidden rounded">
                          {product ? (
                            <img
                              src={`/api/product/photo/${product._id}`}
                              className="w-full h-full object-cover"
                              alt={product.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-black">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {getCategoryName(product.category)}
                      </td>
                      <td className="py-3 px-4">
                        {product.discount > 0 ? (
                          <div>
                            <span className="text-pink-500 font-medium">
                              ${product.discountedPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-black">${product.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`${
                            product.quantity > 10
                              ? "text-green-600"
                              : product.quantity > 0
                              ? "text-orange-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              alert(`Delete product: ${product._id}`);
                            }}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {products?.length ? (currentPage - 1) * limit + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, total)}
                    </span>{" "}
                    of <span className="font-medium">{total}</span> categories
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNum
                              ? "z-10 bg-pink-500 text-white focus-visible:outline-offset-0"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsTable;
