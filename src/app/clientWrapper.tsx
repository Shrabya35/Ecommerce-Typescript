"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "../redux/store";

import Footer from "@/components/specific/footer";
import Navbar from "@/components/specific/navbar";

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      {!pathname.startsWith("/auth") && <Navbar />}
      {children}
      {!pathname.startsWith("/auth") && <Footer />}
      <ToastContainer />
    </Provider>
  );
}
