"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "../redux/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Footer from "@/components/specific/footer";
import Navbar from "@/components/specific/navbar";
import Offer from "@/components/section/offer";
import GlobalLoader from "@/components/common/globalLoader";
const queryClient = new QueryClient();

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GlobalLoader />
        {!pathname.startsWith("/auth") && <Offer />}
        {!pathname.startsWith("/auth") && <Navbar />}
        {children}
        {!pathname.startsWith("/auth") && <Footer />}
        <ToastContainer />
      </Provider>
    </QueryClientProvider>
  );
}
