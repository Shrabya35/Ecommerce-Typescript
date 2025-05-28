"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  MdDashboard,
  MdCategory,
  MdInventory2,
  MdPeople,
  MdKeyboardArrowDown,
  MdLogout,
} from "@/components/icons";
import Image from "next/image";
import { Logo2 } from "@/assets";
import { useLogout } from "@/hooks/useLogout";

type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
};

interface SidebarProps {
  isOpen: boolean;
  isMobile?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    path: "/profile/admin",
  },
  {
    label: "Order",
    icon: <MdInventory2 size={20} />,
    children: [
      { label: "All Orders", path: "/profile/admin/order/all" },
      { label: "Processing", path: "/profile/admin/order/processing" },
      { label: "Completed", path: "/profile/admin/order/completed" },
      { label: "Cancelled", path: "/profile/admin/order/cancelled" },
    ],
  },
  {
    label: "Product",
    icon: <MdInventory2 size={20} />,
    path: "/profile/admin/product",
  },
  {
    label: "Category",
    icon: <MdCategory size={20} />,
    path: "/profile/admin/category",
  },
  {
    label: "Users",
    icon: <MdPeople size={20} />,
    path: "/profile/admin/users",
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMobile,
  setIsSidebarOpen,
}) => {
  const handleLogout = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleClick = (path?: string) => {
    if (path) {
      router.push(path);
      if (isMobile) {
        setIsSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <aside
      className={`bg-gray-100 text-black h-full border-r border-gray-100 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        <div
          className={`flex items-center ${
            isOpen ? "px-6" : "justify-center"
          } h-16 border-b border-gray-300`}
        >
          <div className="w-8 h-8">
            <Image src={Logo2} alt="Logo" width={32} height={32} />
          </div>
          <span
            className={`ml-3 font-semibold text-black transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            LynxLine's Panel
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pt-6 space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            const isDropdownActive =
              item.children?.some((child) => pathname === child.path) || false;

            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() =>
                    item.children
                      ? toggleDropdown(item.label)
                      : handleClick(item.path)
                  }
                  className={`flex items-center cursor-pointer w-full py-2.5 px-3 rounded-lg text-left transition-colors ${
                    isActive || isDropdownActive
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "hover:bg-gray-300 text-black"
                  }`}
                >
                  <div className="w-5 flex justify-center">{item.icon}</div>
                  <span
                    className={`ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.children && isOpen && (
                    <MdKeyboardArrowDown
                      className={`ml-auto transition-transform ${
                        openDropdowns[item.label] ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  )}
                </button>

                {item.children && isOpen && (
                  <div
                    className={`overflow-hidden transition-all duration-300 pl-10 pr-2 ${
                      openDropdowns[item.label]
                        ? "max-h-96 opacity-100 py-1.5"
                        : "max-h-0 opacity-0 py-0"
                    }`}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <button
                          key={child.label}
                          onClick={() => handleClick(child.path)}
                          className={`w-full text-left py-2 px-2 rounded-md text-xs cursor-pointer hover:bg-gray-300 transition-colors ${
                            isChildActive
                              ? "text-pink-500 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 mt-2 border-t border-gray-100">
          <button
            className="flex items-center py-2.5 px-3 w-full rounded-lg text-black cursor-pointer hover:bg-gray-300 transition-all duration-200"
            onClick={handleLogout}
          >
            <div className="w-5 flex justify-center">
              <MdLogout size={20} className="text-pink-500" />
            </div>
            <span
              className={`ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
