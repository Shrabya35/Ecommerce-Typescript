"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

import {
  IoMenuOutline,
  IoCloseOutline,
  IoSearchOutline,
  IoHomeOutline,
  IoShirtOutline,
  IoPersonOutline,
  IoArrowForward,
  FaRegHeart,
  FaUserCircle,
  FaShoppingBag,
} from "@/components/icons";

import { toast } from "react-toastify";
import { Logo2 } from "@/assets";

const Navbar = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Ensure the component has mounted before rendering client-side logic
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
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-page?search=${searchTerm}`);
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
      icon: <IoPersonOutline className="w-5 h-5" />,
    },
    {
      label: "My Wishlist",
      action: handleWishlist,
      icon: <FaRegHeart className="w-5 h-5" />,
    },
    {
      label: "My Cart",
      href: "/cart",
      icon: <FaShoppingBag className="w-5 h-5" />,
      badge: user?.shoppingBag?.length ?? 0,
    },
  ];

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

        <nav className="hidden md:flex justify-center flex-1 mx-4">
          <div className="flex gap-10">
            {["men", "women", "accessories"].map((type) => (
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

        <div className="flex items-center gap-1 md:gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={toggleSearch}
            aria-label="Toggle Search"
          >
            <IoSearchOutline className="w-5 h-5 text-gray-800" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 md:flex cursor-pointer hidden"
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <FaRegHeart className="w-5 h-5 text-gray-800" />
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

          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 relative"
            aria-label="Cart"
          >
            <FaShoppingBag className="w-5 h-5 text-gray-800" />
            {hasMounted && (user?.shoppingBag?.length ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                {user?.shoppingBag?.length ?? 0}
              </span>
            )}
          </Link>
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

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
          >
            <IoSearchOutline className="text-xl text-gray-600" />
            <input
              ref={inputRef}
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full border-none outline-none bg-gray-100 py-2 text-base font-medium text-gray-900 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <IoCloseOutline className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </form>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {["Fresh Fits", "Dresses", "Sneakers", "Summer", "Sale"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term);
                    }}
                    className="px-3 py-1 cursor-pointer bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

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
                <h1 className="text-lg font-semibold text-gray-900">
                  LynxLine
                </h1>
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
            <form
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
              onSubmit={handleSearch}
            >
              <IoSearchOutline className="text-lg text-gray-600" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full border-none outline-none bg-gray-100 py-1 text-base text-gray-900 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <IoCloseOutline className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </form>
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
                      <span className="text-base font-medium">
                        {link.label}
                      </span>
                    </div>
                    {typeof window !== "undefined" && link.badge ? (
                      <span className="bg-black text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
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
                      <span className="text-base font-medium">
                        {link.label}
                      </span>
                    </div>
                    <IoArrowForward className="w-4 h-4 text-gray-500" />
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
    </header>
  );
};

export default Navbar;
