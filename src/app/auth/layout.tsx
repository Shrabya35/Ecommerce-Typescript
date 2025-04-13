"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Logo, Logo2 } from "../../assets";
import { PulseLoader } from "react-spinners";
import { useAuth } from "@/hooks/useAuth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, authChecked } = useAuth();
  const [activeTab, setActiveTab] = useState(
    pathname.includes("register") ? "register" : "login"
  );
  const [loadingPage, setLoadingPage] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setActiveTab(pathname.includes("register") ? "register" : "login");
  }, [pathname]);

  useEffect(() => {
    if (!authChecked) return;

    if (isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setLoadingPage(false);
    }
  }, [authChecked, isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <PulseLoader color="#000" loading={true} size={10} />
          <p className="mt-4 text-gray-600">Redirecting to Homepage...</p>
        </div>
      </div>
    );
  }

  if (!authChecked || loadingPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <PulseLoader color="#000" loading={true} size={10} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:flex w-1/2 relative flex-shrink-0">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12 gap-6">
          <Image
            src={Logo}
            alt="LynxLine Logo"
            width={96}
            height={96}
            className="mb-2"
          />
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to LynxLine
          </h1>
          <p className="text-xl max-w-md mx-auto opacity-90">
            Save your most-loved activewear pieces to build your perfect outfit
          </p>
          <div className="w-16 h-1 bg-white rounded-full mt-2 mb-4" />
          <p className="text-lg font-light italic">Unleash your inner beast</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-screen overflow-y-auto">
        <div className="flex flex-col py-10 px-4 sm:px-10 md:px-16 lg:px-20 items-center">
          <div className="flex lg:hidden justify-center items-center mb-8">
            <Image src={Logo2} alt="LynxLine Logo" width={80} height={80} />
          </div>

          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {activeTab === "login" ? "Welcome Back" : "Join LynxLine"}
              </h2>
              <p className="text-gray-600 mt-2">
                {activeTab === "login"
                  ? "Sign in to continue to your account"
                  : "Create an account to get started"}
              </p>
            </div>

            <div className="relative flex rounded-xl bg-gray-100 mb-8">
              <div
                className={`absolute top-0 bottom-0 w-1/2 bg-black rounded-lg shadow-md transition-all duration-300 transform ${
                  activeTab === "login" ? "translate-x-0" : "translate-x-full"
                }`}
              />
              <Link
                href="/auth/login"
                className={`w-1/2 py-2 text-center font-medium relative z-10 ${
                  activeTab === "login" ? "text-white" : "text-gray-800"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className={`w-1/2 py-2 text-center font-medium relative z-10 ${
                  activeTab === "register" ? "text-white" : "text-gray-800"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </Link>
            </div>

            <div className="p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
