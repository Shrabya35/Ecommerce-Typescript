"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

import { PulseLoader } from "react-spinners";

const UserComponent = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
    if (isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        router.push("/profile/admin");
      }, 2000);
    }
  }, [isAuthenticated, router]);

  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <PulseLoader color="#000" loading={true} size={10} />
          <p className="mt-4 text-gray-600">Redirecting ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div>lol</div>
    </div>
  );
};

export default UserComponent;
