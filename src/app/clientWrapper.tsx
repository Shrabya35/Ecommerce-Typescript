"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux"; // Correct import
import store from "../redux/store";
import { usePathname } from "next/navigation";

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      {/* Ensure Provider is used as a component */}
      {children}
      <ToastContainer />
    </Provider>
  );
}
