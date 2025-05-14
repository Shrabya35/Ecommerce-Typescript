"use client";

import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import {
  IoCloseOutline,
  IoHomeOutline,
  IoShirtOutline,
  IoArrowForward,
  FaRegHeart,
  FaShoppingBag,
} from "@/components/icons";
import { Logo2 } from "@/assets";
import SearchBar from "./SearchBar";

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  hasMounted: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  closeMenu,
  searchTerm,
  setSearchTerm,
  handleSearch,
  hasMounted,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const { total: totalWishlist } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { total: totalBagItems } = useSelector(
    (state: RootState) => state.shoppingBag
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleWishlist = () => {
    if (isAuthenticated) {
      window.location.href = "/wishlist"; // Replace with useRouter if needed
    } else {
      toast.error("Sign in to save and view your wishlist");
    }
  };

  const menuLinks = [
    {
      label: "Men",
      href: "/pages/men",
      icon: <IoShirtOutline className="w-5 h-5" />,
    },
    {
      label: "Women",
      href: "/pages/women",
      icon: <IoShirtOutline className="w-5 h-5" />,
    },
    {
      label: "Accessories",
      href: "/pages/accessories",
      icon: <IoShirtOutline className="w-5 h-5" />,
    },
    {
      label: "My Wishlist",
      action: handleWishlist,
      icon: <FaRegHeart className="w-5 h-5" />,
      badge: totalWishlist,
    },
    {
      label: "My Shopping Bag",
      href: "/shopping-bag",
      icon: <FaShoppingBag className="w-5 h-5" />,
      badge: totalBagItems,
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isMenuOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={closeMenu}
      />
      <div
        ref={menuRef}
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="sticky top-0 z-10 bg-white px-5 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={closeMenu}
            >
              <Image src={Logo2} alt="Logo" className="w-9 h-9" />
              <h1 className="text-lg font-semibold text-gray-900">LynxLine</h1>
            </Link>
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-800"
              onClick={closeMenu}
              aria-label="Close Menu"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={handleSearch}
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-50"
              onClick={closeMenu}
            >
              <IoHomeOutline className="w-5 h-5" />
              <span className="text-base font-medium">Home</span>
            </Link>
          </div>

          <div className="mt-2 px-3">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Shop Categories
            </p>
            {menuLinks.slice(0, 3).map((link, index) => (
              <Link
                key={index}
                href={link.href || "/"}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-50"
                onClick={closeMenu}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span className="text-base font-medium">{link.label}</span>
                </div>
                <IoArrowForward className="w-4 h-4 text-gray-500" />
              </Link>
            ))}
          </div>

          <div className="mt-2 px-3">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Other
            </p>
            {menuLinks.slice(3).map((link, index) =>
              link.href ? (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="text-base font-medium">{link.label}</span>
                  </div>
                  {hasMounted && (link.badge ?? 0) > 0 ? (
                    <span className="bg-pink-500 text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                      {link.badge}
                    </span>
                  ) : (
                    <IoArrowForward className="w-4 h-4 text-gray-500" />
                  )}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    link.action?.();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-gray-800 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="text-base font-medium">{link.label}</span>
                  </div>
                  {hasMounted && (link.badge ?? 0) > 0 ? (
                    <span className="bg-pink-500 text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                      {link.badge}
                    </span>
                  ) : (
                    <IoArrowForward className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )
            )}
          </div>
        </nav>

        <div className="border-t border-gray-100 p-5">
          <div className="flex flex-col items-center gap-3">
            {isAuthenticated && hasMounted ? (
              <Link
                href="/profile/user"
                onClick={closeMenu}
                className="w-full py-3 bg-black text-white rounded-lg font-medium text-center"
              >
                My Account
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className="w-full py-3 bg-black text-white rounded-lg font-medium text-center"
              >
                Sign In
              </Link>
            )}
            {!isAuthenticated && hasMounted && (
              <Link
                href="/auth/register"
                onClick={closeMenu}
                className="w-full py-3 border border-black text-black rounded-lg font-medium text-center"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
