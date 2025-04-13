import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

export const useAuth = () => {
  const { user, token, isAdmin, authChecked } = useSelector(
    (state: RootState) => state.auth
  );

  const isAuthenticated = useMemo(() => {
    return !!token || !!user;
  }, [token, user]);

  return {
    isAuthenticated,
    user,
    token,
    isAdmin,
    authChecked,
  };
};
