import React, { useState, useRef, FormEvent, useEffect, useMemo } from "react";
import { Logo2 } from "@/assets";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

import {
  IoMenuOutline,
  IoCloseOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { FaRegHeart, FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleWishlist = () => {
    if (isAuthenticated) {
      router.push("/wishlist");
    } else {
      toast.error("Sign in to save and view your wishlist");
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-page?search=${searchTerm}`);
      setSearchOpen(false);
      setMenuOpen(false);
      inputRef.current?.blur();
    }
  };

  const toggleSearch = () => setSearchOpen(!isSearchOpen);

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="w-full flex justify-between items-center shadow-md px-4 py-3 md:px-8 md:py-4 bg-white">
        <div className="flex items-center">
          <button
            className="text-2xl p-1 rounded-full hover:bg-gray-100 md:hidden mr-2"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <IoMenuOutline className="w-6 h-6 text-gray-800" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo2}
              alt="LynxLine Logo"
              className="w-10 h-10 md:w-10 md:h-10"
            />
            <h1 className="text-xl font-semibold text-gray-900">LynxLine</h1>
          </Link>
        </div>

        <nav className="hidden md:flex justify-center flex-1 mx-4">
          <div className="flex gap-10">
            <Link
              href="/type/men"
              className="text-base font-medium text-gray-800 hover:text-black py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
            >
              Men
            </Link>
            <Link
              href="/type/women"
              className="text-base font-medium text-gray-800 hover:text-black py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
            >
              Women
            </Link>
            <Link
              href="/type/accessories"
              className="text-base font-medium text-gray-800 hover:text-black py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
            >
              Accessories
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <IoSearchOutline className="w-5 h-5 text-gray-800" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors md:flex hidden"
            onClick={handleWishlist}
            aria-label="Wishlist"
          >
            <FaRegHeart className="w-5 h-5 text-gray-800" />
          </button>

          {isClient && (
            <Link
              href={isAuthenticated ? "/profile/user" : "/auth/login"}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              <FaUserCircle className="w-5 h-5 text-gray-800" />
            </Link>
          )}

          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Shopping Bag"
          >
            <FaShoppingBag className="w-5 h-5 text-gray-800" />
            {(user?.shoppingBag?.length ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                {user?.shoppingBag?.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
