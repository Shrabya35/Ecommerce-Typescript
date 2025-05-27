"use client";

import React, { useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utils/formatDate";
import { fetchSingleOrder } from "@/redux/slices/userOrderSlice";
import { ClipLoader } from "react-spinners";
import { Package, Check, CreditCard } from "@/components/icons";
const OrderDetail = ({ id }: { id: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleOrder, loading, error } = useSelector(
    (state: RootState) => state.userOrder
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleOrder({ id }));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <ClipLoader size={40} color="#E91E63" />
              <p className="text-lg text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">
                Error Loading Order
              </h2>
              <p className="text-gray-600 max-w-md">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600">
                The order you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">
                Order ID:{" "}
                <span className="font-mono text-black font-medium">
                  {singleOrder._id}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative space-y-6 sm:space-y-0">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 sm:-translate-y-1/2 z-0 sm:block hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    singleOrder.status === "cancelled"
                      ? "bg-red-600 w-full"
                      : singleOrder.status === "completed"
                      ? "bg-black w-full"
                      : singleOrder.status === "processing"
                      ? "bg-black w-1/2"
                      : "bg-black w-0"
                  }`}
                ></div>
              </div>

              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    singleOrder.status === "cancelled"
                      ? "bg-red-600"
                      : "bg-black"
                  }`}
                >
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    singleOrder.status === "cancelled"
                      ? "text-red-600"
                      : "text-black"
                  }`}
                >
                  Order Placed
                </p>
                <p
                  className={`text-xs ${
                    singleOrder.status === "cancelled"
                      ? "text-red-400"
                      : "text-gray-600"
                  }`}
                >
                  {formatDate(singleOrder.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    singleOrder.status === "processing" ||
                    singleOrder.status === "completed"
                      ? "bg-black"
                      : singleOrder.status === "cancelled"
                      ? "bg-red-600"
                      : "bg-gray-300"
                  }`}
                >
                  {(singleOrder.status === "processing" ||
                    singleOrder.status === "completed") && (
                    <Check className="w-6 h-6 text-white" />
                  )}
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    singleOrder.status === "processing" ||
                    singleOrder.status === "completed"
                      ? "text-black"
                      : singleOrder.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  Processing
                </p>
                <p
                  className={`text-xs ${
                    singleOrder.status === "processing" ||
                    singleOrder.status === "completed"
                      ? "text-gray-600"
                      : singleOrder.status === "cancelled"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {singleOrder.status === "processing" ||
                  singleOrder.status === "completed"
                    ? "In Progress"
                    : singleOrder.status === "cancelled"
                    ? "Cancelled"
                    : "Pending"}
                </p>
              </div>

              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    singleOrder.status === "completed"
                      ? "bg-black"
                      : singleOrder.status === "cancelled"
                      ? "bg-red-600"
                      : "bg-gray-300"
                  }`}
                >
                  {singleOrder.status === "completed" && (
                    <Check className="w-6 h-6 text-white" />
                  )}
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    singleOrder.status === "completed"
                      ? "text-black"
                      : singleOrder.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  Delivered
                </p>
                <p
                  className={`text-xs ${
                    singleOrder.status === "completed"
                      ? "text-gray-600"
                      : singleOrder.status === "cancelled"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {singleOrder.status === "completed"
                    ? "Completed"
                    : singleOrder.status === "cancelled"
                    ? "Cancelled"
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      Order Items
                    </h2>
                    <p className="text-sm text-gray-600">
                      {singleOrder.product?.length || 0} item(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {singleOrder.product?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col lg:flex-row gap-4 p-5 border border-gray-100 rounded-lg hover:border-pink-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
                        <img
                          src={`/api/product/photo/${item.product._id}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-lg font-semibold text-black mb-2">
                          {item.product?.name || "Product Name"}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {item.product?.description ||
                            "No description available"}
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                            <span className="font-medium">Type:</span>{" "}
                            {item.product?.type || "Unknown"}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                            <span className="font-medium">Qty:</span>{" "}
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-center lg:text-right lg:w-32 flex-shrink-0">
                        <div className="space-y-1">
                          {item.product?.discount > 0 && (
                            <p className="text-sm text-gray-400 line-through">
                              ${item.product.price}
                            </p>
                          )}
                          <p className="text-lg font-semibold text-black">
                            $
                            {item.product?.discountedPrice ||
                              item.product?.price ||
                              0}
                          </p>
                          <p className="text-sm text-gray-600">per unit</p>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <p className="text-lg font-bold text-pink-600">
                              $
                              {(
                                (item.product?.discountedPrice ||
                                  item.product?.price ||
                                  0) * item.quantity
                              ).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">subtotal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Payment Information */}
            {(singleOrder.esewaRefId || singleOrder.transactionUuid) && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-black">
                        Payment Information
                      </h2>
                      <p className="text-sm text-gray-600">
                        Transaction details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Payment Method
                        </p>
                        <p className="text-base font-semibold text-black">
                          eSewa
                        </p>
                      </div>
                      {singleOrder.esewaRefId && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Reference ID
                          </p>
                          <p className="text-base font-mono text-black bg-gray-50 px-3 py-2 rounded border break-all">
                            {singleOrder.esewaRefId}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Payment Status
                        </p>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                          <Check className="w-3 h-3" />
                          Confirmed
                        </span>
                      </div>
                      {singleOrder.transactionUuid && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Transaction UUID
                          </p>
                          <p className="text-base font-mono text-black bg-gray-50 px-3 py-2 rounded border break-all">
                            {singleOrder.transactionUuid}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Right Column - Summary & Address */}
          <div className="xl:col-span-4 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      Order Summary
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-center">
                  <p className="text-black font-medium text-base">
                    {singleOrder.user?.name}
                  </p>
                  <p className="text-black font-medium text-base">
                    {singleOrder.address?.street}
                  </p>
                  {singleOrder.address?.secondary && (
                    <p className="text-gray-600">
                      {singleOrder.address.secondary}
                    </p>
                  )}
                  <p className="text-black">
                    {singleOrder.address?.city},{" "}
                    {singleOrder.address?.postalCode}
                  </p>
                  <p className="text-black font-semibold">
                    {singleOrder.address?.country}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-black">
                      Total
                    </span>
                    <span className="text-xl font-bold text-pink-600">
                      ${singleOrder.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
