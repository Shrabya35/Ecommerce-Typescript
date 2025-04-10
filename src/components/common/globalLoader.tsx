"use client";

import { useLoading } from "@/context/loadingContext";
import { ClipLoader } from "react-spinners";

const GlobalLoader: React.FC = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]">
      <ClipLoader size={60} color="#ffffff" />
    </div>
  );
};

export default GlobalLoader;
