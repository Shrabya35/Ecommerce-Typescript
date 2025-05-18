"use client";

import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBag } from "@/redux/slices/shoppingBagSlice";
import Link from "next/link";
import Image from "next/image";
import { NoProduct, NoAuth } from "@/assets";
import { IoCloseOutline, FaShoppingBag } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { ClipLoader } from "react-spinners";
import { formatNumberNPR } from "@/utils/formatNumberNpr";

interface QuickCartProps {
  isCartOpen: boolean;
  closeCart: () => void;
}

const QuickCart: React.FC<QuickCartProps> = ({ isCartOpen, closeCart }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const cartRef = useRef<HTMLDivElement>(null);
  const { bag, loading, error } = useSelector(
    (state: RootState) => state.shoppingBag
  );

  useEffect(() => {
    if (!isCartOpen || !isAuthenticated) return;

    dispatch(fetchBag({ page: 1, limit: 10 }));
  }, [isCartOpen, isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        isCartOpen
      ) {
        closeCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#000" loading={true} size={24} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoProduct}
            className="w-40 h-40 object-cover"
            alt="error"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">Error: {error}</h1>
          <p>
            Something went wrong while fetching your bag. Please try again
            later.
          </p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoAuth}
            className="w-40 h-40 object-cover"
            alt="not logged in"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Please log in to view your bag
          </h1>
          <p>Sign in to access your saved products and cart.</p>
        </div>
      );
    }

    if (bag.length === 0) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoProduct}
            className="w-40 h-40 object-cover"
            alt="empty bag"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Your Bag is empty
          </h1>
          <p>Add products to your bag to see them here.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-6 p-3 sm:p-4">
        {bag.map((item, index) => {
          if (!item || !item.product) return null; // Skip invalid entries

          return (
            <li
              key={`${item.product._id}-${index}`}
              className="flex items-center justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={`/api/product/photo/${item.product._id}`}
                  className="w-full h-full object-cover"
                  alt={`Image of ${item.product.name}`}
                  width={500}
                  height={300}
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow space-y-2">
                {item.product.discount > 0 && (
                  <span className="text-xs font-semibold text-white bg-pink-500 w-fit px-3 py-1.5 tracking-tight">
                    {item.product.discount}% OFF
                  </span>
                )}

                <h3 className="text-base sm:text-xl text-gray-900 tracking-tight">
                  {item.product.name}
                </h3>

                {item.product.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-pink-500 line-through ml-2">
                      ₹ {formatNumberNPR(item.product.price)}
                    </span>
                    <span className="text-black font-medium">
                      ₹ {formatNumberNPR(item.product.discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-black">
                    ₹ {formatNumberNPR(item.product.price)}
                  </span>
                )}
                <p className="text-sm font-bold text-gray-700">
                  Qty: {item.quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isCartOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <div
        ref={cartRef}
        className={`absolute top-0 right-0 h-full w-[85%] max-w-xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="sticky top-0 z-10 bg-white px-5 py-4 border-b shadow-sm border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Your Bag</h2>
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-800 cursor-pointer"
              onClick={closeCart}
              aria-label="Close Cart"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {renderContent()}
        </div>

        <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
          <Link
            href={isAuthenticated ? "/shopping-bag" : "/auth/login"}
            onClick={closeCart}
            className="flex items-center justify-center gap-2 w-full bg-black text-white font-medium py-3 px-6 rounded-full cursor-pointer hover:bg-gray-800 transition duration-200"
          >
            <span>{isAuthenticated ? "Visit Bag" : "Log In"}</span>
            {isAuthenticated && (
              <FaShoppingBag className="w-4 h-4 text-white" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickCart;
