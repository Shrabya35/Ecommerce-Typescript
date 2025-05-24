"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PulseLoader } from "react-spinners";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, authChecked } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("admin ho?", isAdmin);
    if (isAuthenticated === undefined) return;

    if (authChecked && !isAuthenticated) {
      router.push("/auth/login");
    } else if (authChecked && isAuthenticated && isAdmin) {
      router.push("/profile/admin");
    } else {
      setLoading(false);
    }
  }, [authChecked, isAuthenticated, isAdmin, router]);
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
  return <>{children}</>;
}
