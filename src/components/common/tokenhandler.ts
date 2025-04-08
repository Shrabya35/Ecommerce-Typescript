"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setTokenFromStorage } from "../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";

const TokenHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken && !token) {
      dispatch(setTokenFromStorage());
    }
  }, [dispatch, token]);

  return null;
};

export default TokenHandler;
