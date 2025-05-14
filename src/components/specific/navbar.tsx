"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import { popularSearches } from "@/constants";

import {
  IoMenuOutline,
  IoCloseOutline,
  IoSearchOutline,
  FaRegHeart,
  FaUserCircle,
  FaShoppingBag,
  TrendingUp,
} from "@/components/icons";

import { toast } from "react-toastify";
import { Logo2 } from "@/assets";

import SearchBar from "../ui/nav/SearchBar";
import MobileMenu from "../ui/nav/MobileMenu";
import QuickCart from "../ui/nav/quickCart";

const DesktopNav: React.FC = () => {
  const links = ["men", "women", "accessories"];

  return (
    <nav className="hidden md:flex justify-center flex-1 mx-4">
      <div className="flex gap-10">
        {links.map((type) => (
          <Link
            key={type}
            href={`/pages/${type}`}
            className="text-base font-medium text-gray-800 hover:text-black py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Navbar = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated } = useAuth();
  const { total: totalWishlist } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { total: totalBagItems } = useSelector(
    (state: RootState) => state.shoppingBag
  );

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleCart = () => setCartOpen(!isCartOpen);
  const closeCart = () => setCartOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen, isCartOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
      setSearchOpen(false);
      setMenuOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleWishlist = () => {
    if (isAuthenticated) {
      router.push("/wishlist");
    } else {
      toast.error("Sign in to save and view your wishlist");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="w-full flex justify-between items-center shadow-md px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center">
          <button
            className="text-2xl p-1 rounded-full hover:bg-gray-100 md:hidden mr-2"
            onClick={toggleMenu}
            aria-label="Open Menu"
          >
            <IoMenuOutline className="w-6 h-6 text-gray-800" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo2} alt="LynxLine Logo" className="w-10 h-10" />
            <h1 className="text-xl font-semibold text-gray-900">LynxLine</h1>
          </Link>
        </div>

        <DesktopNav />

        <div className="flex items-center gap-1 md:gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={toggleSearch}
            aria-label="Toggle Search"
          >
            <IoSearchOutline className="w-5 h-5 text-gray-800" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 md:flex cursor-pointer hidden relative"
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <FaRegHeart className="w-5 h-5 text-gray-800" />
            {hasMounted && totalWishlist > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </button>

          <Link
            href={
              isAuthenticated && hasMounted ? "/profile/user" : "/auth/login"
            }
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="User Profile"
          >
            <FaUserCircle className="w-5 h-5 text-gray-800" />
          </Link>

          <button
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer relative"
            onClick={toggleCart}
            aria-label="Shopping Bag"
          >
            <FaShoppingBag className="w-5 h-5 text-gray-800" />
            {hasMounted && totalBagItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                {totalBagItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white ${
          isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
      >
        <div className="p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">
              Search Products
            </h2>
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={handleSearch}
            autoFocus={true}
          />
          <div className="mt-6">
            <div className="flex gap-2 items-center mb-3">
              <TrendingUp className="w-5 font-bold" />
              <p className="text-sm font-medium text-gray-700">
                Popular Searches
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                  }}
                  className="px-3 py-1 cursor-pointer bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        hasMounted={hasMounted}
      />

      <QuickCart isCartOpen={isCartOpen} closeCart={closeCart} />
    </header>
  );
};

export default Navbar;
