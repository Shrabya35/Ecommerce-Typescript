"use client";

import { useState, useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "@/redux/slices/userOrderSlice";
import {
  ProfileTab,
  SettingsTab,
  AddressTab,
} from "@/components/specific/UserComponent";
import WishListTab from "@/app/wishlist/wishlistPage";
import {
  FaRegHeart,
  ChevronRightIcon,
  MdLogout,
  Settings,
  MapPin,
  User,
} from "@/components/icons";

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { total: wishlistCount } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(fetchUserOrders({ page: 1, limit: 6 })).unwrap();
  }, [dispatch]);

  const navItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <User size={18} className="mr-3" />,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: <FaRegHeart size={18} className="mr-3" />,
      count: wishlistCount,
    },
    {
      key: "address",
      label: "Address",
      icon: <MapPin size={18} className="mr-3" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings size={18} className="mr-3" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <User size={20} className="text-pink-500" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-md  text-pink-500 hover:text-pink-400 cursor-pointer">
                <div className="flex items-center">
                  <MdLogout size={18} className="mr-3" />
                  <span>Log Out</span>
                </div>
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ key, label, icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-md hover:bg-gray-50 cursor-pointer${
                    activeTab === key
                      ? "font-medium bg-pink-50 text-pink-500 cursor-pointer hover:bg-pink-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {icon}
                      <span>{label}</span>
                    </div>
                    {typeof count === "number" && count > 0 && (
                      <span className=" bg-pink-500 text-white rounded-full text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                  <ChevronRightIcon size={16} />
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && <ProfileTab />}

            {activeTab === "wishlist" && <WishListTab />}

            {activeTab === "address" && <AddressTab />}

            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
