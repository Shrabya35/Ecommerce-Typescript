import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearCategory } from "@/redux/slices/categorySlice";
import { clearOrder, clearCurrentOrder } from "@/redux/slices/orderSlice";
import { clearProduct } from "@/redux/slices/productSlice";
import { clearUserOrders } from "@/redux/slices/userOrderSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";
import { clearBag } from "@/redux/slices/shoppingBagSlice";
import { toast } from "react-toastify";

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const performLogout = async () => {
    try {
      dispatch(logout());
      dispatch(clearCategory());
      dispatch(clearOrder());
      dispatch(clearCurrentOrder());
      dispatch(clearProduct());
      dispatch(clearUserOrders());
      dispatch(clearWishlist());
      dispatch(clearBag());

      window.location.href = "/auth/login";
    } catch (error: any) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return performLogout;
};
