"use client";

import React, { FormEvent, useRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "@/components/icons";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSubmit: (e: FormEvent) => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
    >
      <IoSearchOutline className="text-lg text-gray-600" />
      <input
        ref={inputRef}
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
  );
};

export default SearchBar;
