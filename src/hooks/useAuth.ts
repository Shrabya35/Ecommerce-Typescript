import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

export const useAuth = () => {
  const { user, token, isAdmin } = useSelector(
    (state: RootState) => state.auth
  );

  const storedToken =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  const isAuthenticated = useMemo(() => {
    return !!token || !!storedToken;
  }, [token, storedToken]);

  return {
    isAuthenticated,
    user,
    token: token || storedToken,
    isAdmin,
  };
};
