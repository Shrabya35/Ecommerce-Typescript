"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  readTokenFromCookie,
  checkAdminAuth,
  fetchUserDetails,
} from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";

const TokenHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    dispatch(readTokenFromCookie());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(checkAdminAuth());
      dispatch(fetchUserDetails());
    }
  }, [dispatch, token]);

  return null;
};

export default TokenHandler;
