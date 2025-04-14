"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdMenu, MdClose, MdNotifications } from "@/components/icons";
import { Logo } from "@/assets";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Notification = {
  id: number;
  text: string;
  time: string;
};

interface AdminNavProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const notifications: Notification[] = [
    { id: 1, text: "New project assigned", time: "2 min ago" },
    { id: 2, text: "Meeting scheduled at 3 PM", time: "1 hour ago" },
    { id: 3, text: "Your submission was approved", time: "5 hours ago" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm z-10 h-16 sticky top-0">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mr-2 text-black cursor-pointer hover:text-pink-500 hover:bg-gray-100 rounded-full  transition-all"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <MdClose className="w-5 h-5" />
            ) : (
              <MdMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 text-black hover:text-pink-500 hover:bg-gray-100 rounded-full cursor-pointer relative transition-all">
              <MdNotifications className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 border border-gray-100 focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-black">
                    Notifications
                  </h2>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-100 transition-colors">
                        <p className="text-sm text-black">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </Menu.Item>
                  ))}
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/notifications"
                      className={`block px-4 py-2 text-sm text-center ${
                        active ? "bg-gray-50 text-black" : "text-pink-500"
                      } transition-colors`}
                    >
                      View all notifications
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center text-sm cursor-pointer border-2 border-gray-300 rounded-full p-1">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={Logo}
                  alt="User Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="ml-2 font-medium text-black hidden md:block">
                {user?.name}
              </span>
              <svg
                className="ml-1 h-5 w-5 text-gray-400 hidden md:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 focus:outline-none z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2.5 text-sm ${
                        active ? "bg-gray-50 text-pink-500" : "text-pink-500"
                      } transition-colors`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
