import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearCategory } from "@/redux/slices/categorySlice";
import { clearOrder } from "@/redux/slices/orderSlice";
import { clearProduct } from "@/redux/slices/productSlice";
import { clearUserOrders } from "@/redux/slices/userOrderSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";
import { clearBag } from "@/redux/slices/shoppingBagSlice";
import { toast } from "react-toastify";

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const performLogout = async () => {
    try {
      localStorage.removeItem(`recentlyViewed_${user?._id}`);
      dispatch(logout());
      dispatch(clearCategory());
      dispatch(clearOrder());
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
