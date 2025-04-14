"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { PulseLoader } from "react-spinners";

const UserComponent = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("admin ho?", isAdmin);
    if (isAuthenticated === undefined) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (isAuthenticated && isAdmin) {
      router.push("/profile/admin");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, router]);

  if (loading) {
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
    <div className="h-screen w-full">
      <div>lol</div>
    </div>
  );
};

export default UserComponent;
