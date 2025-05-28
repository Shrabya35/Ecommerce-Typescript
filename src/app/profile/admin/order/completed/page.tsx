"use client";

import React, { useState, useEffect } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, Order } from "@/redux/slices/orderSlice";
import { ChevronLeftIcon, ChevronRightIcon, Eye } from "@/components/icons";
import { Tooltip } from "antd";
import Link from "next/link";
import { formatNumberNPR } from "@/utils/formatNumberNpr";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { NoWishlist } from "@/assets";

interface Address {
  country: string;
  city: string;
  street: string;
  secondary?: string;
  postalCode: string;
}

const CompletedOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    completedOrders: orders,
    completedTotal: total,
    totalPages,
    page,
    limit,
    loading,
  } = useSelector((state: RootState) => state.order);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getOrders({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage: number): void => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatAddress = (address: Address): string => {
    const secondary = address.secondary ? `${address.secondary}, ` : "";
    return `${address.street}, ${secondary}${address.city}, ${address.country} - ${address.postalCode}`;
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex gap-3 items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Completed Orders</h1>
        <p className="text-sm text-gray-700">{total} orders</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={40} color="#E91E63" />
        </div>
      ) : orders && orders.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[200px]">
                    Order Id
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[150px]">
                    Customer
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[120px]">
                    Amount
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[150px]">
                    Contact
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[300px]">
                    Address
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[150px]">
                    Date
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[120px]">
                    Mode
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-black border-b border-gray-200 w-[120px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order: Order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="py-3 px-6 text-gray-700 font-bold">
                      #{order._id}{" "}
                    </td>
                    <td className="py-3 px-6 text-gray-700 ">
                      {order.user.name}
                    </td>
                    <td className="py-3 px-6 text-pink-500 font-medium">
                      ₹{formatNumberNPR(order.price)}
                    </td>
                    <td className="py-3 px-6 text-gray-700">
                      {order.user.phone}
                    </td>
                    <td className="py-3 px-6 text-gray-700">
                      {formatAddress(order.address)}
                    </td>
                    <td className="py-3 px-6 text-gray-700">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-6 text-pink-500 font-medium">
                      {order.mode === 0 ? "Cash on Delivery" : "Esewa"}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-3">
                        <Link
                          href={{
                            pathname: `/profile/admin/order/${order._id}`,
                            query: { id: order._id },
                          }}
                          className="text-blue-400 hover:text-blue-800 cursor-pointer"
                        >
                          <Tooltip title="View Order">
                            <button className="text-blue-400 hover:text-blue-800">
                              <Eye className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
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
                      {orders?.length ? (currentPage - 1) * limit + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, total)}
                    </span>{" "}
                    of <span className="font-medium">{total}</span> orders
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
                          key={`page-${pageNum}`}
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
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoWishlist}
            className="w-40 h-40 object-cover"
            alt="No orders"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">No orders found</h1>
          <p className="text-gray-500">
            No orders with status "Completed" found{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;
