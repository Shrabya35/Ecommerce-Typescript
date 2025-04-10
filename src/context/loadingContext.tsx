"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const delayedSetLoading = (value: boolean) => {
    setLoading(true);
    if (value === false) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setLoading(value);
    }
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading: delayedSetLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
