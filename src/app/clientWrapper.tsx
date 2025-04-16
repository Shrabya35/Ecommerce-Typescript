"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Footer from "@/components/specific/footer";
import Navbar from "@/components/specific/navbar";
import Offer from "@/components/section/offer";
import GlobalLoader from "@/components/common/globalLoader";
import TokenHandler from "@/components/common/tokenhandler";

const queryClient = new QueryClient();

interface ClientWrapperProps {
  children: ReactNode;
}

const InnerWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <>
      <TokenHandler key={token} />
      <GlobalLoader />
      {!pathname.startsWith("/auth") &&
        !pathname.startsWith("/profile/admin") && <Offer />}
      {!pathname.startsWith("/auth") &&
        !pathname.startsWith("/profile/admin") && <Navbar />}
      {children}
      {!pathname.startsWith("/auth") &&
        !pathname.startsWith("/profile/admin") && <Footer />}
      <ToastContainer />
    </>
  );
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <InnerWrapper>{children}</InnerWrapper>
      </Provider>
    </QueryClientProvider>
  );
}
