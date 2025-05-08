"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCategory } from "@/redux/slices/categorySlice";
import { useLoading } from "@/context/loadingContext";
import { toast } from "react-toastify";
import Link from "next/link";

const CategorySection = () => {
  const { setLoading } = useLoading();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    dispatch(fetchCategory({ page: 1, limit: 8 }));
  }, [dispatch]);

  if (error) {
    toast.error(error);
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const getSizeClass = (index: number) => {
    const sizes = [
      "w-20 h-20",
      "w-25 h-25 shadow-sm",
      "w-30 h-30 shadow-lg",
      "w-35 h-35 shadow-xl",
      "w-35 h-35 shadow-xl",
      "w-30 h-30 shadow-lg",
      "w-25 h-25 shadow-sm",
      "w-20 h-20",
    ];
    return sizes[index] || "w-32 h-32";
  };

  return (
    <div className="w-full bg-white py-10 px-4 md:px-6 lg:px-8">
      <div className="flex justify-start md:justify-center items-center mb-10">
        <h2 className="text-xl text-gray-800 md:text-2xl font-bold">
          Shop by Category
        </h2>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-5 ml-5 items-center justify-center w-max min-w-full md:w-full md:min-w-0 pb-4">
          {categories.map((cat, i) => (
            <Link
              href={`/products?category=${cat.name || cat._id}`}
              key={cat._id}
              className={`flex-shrink-0 transition-all duration-300 ${getSizeClass(
                i
              )}`}
            >
              <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700 rounded-lg p-1 overflow-hidden  hover:border-pink-500 transition-all flex items-center justify-center">
                <span className="text-xs font-black uppercase text-center text-gray-200 tracking-tight break-words max-w-full">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
