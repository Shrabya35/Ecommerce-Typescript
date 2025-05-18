"use client";

import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Checkout() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    const redirectTimeout = setTimeout(() => {
      window.location.href = "/";
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Checkout Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Thank you for your purchase. You will be redirected to the homepage
        shortly.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-sm h-3 bg-green-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-green-600 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
