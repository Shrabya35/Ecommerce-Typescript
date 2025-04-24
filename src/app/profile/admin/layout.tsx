"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminNav from "@/components/specific/adminNav";
import AdminSidebar from "@/components/specific/adminSidebar";
import { useAuth } from "@/hooks/useAuth";

import { PulseLoader } from "react-spinners";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAuthenticated === undefined) return;

      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (isAuthenticated && !isAdmin) {
        router.push("/profile/user");
      } else {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isAdmin, router]);

  if (loading || isAuthenticated === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <PulseLoader color="#000" loading={true} size={10} />
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div
        className={`fixed h-full z-20 transition-all duration-300 ease-in-out ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        <AdminSidebar
          isOpen={isSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "64px",
        }}
      >
        <AdminNav
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
