import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import wishlistReducer from "./slices/wishlistSlice";
import ShoppingBagReducer from "./slices/shoppingBagSlice";
import UserOrderReducer from "./slices/userOrderSlice";
import OrderReducer from "./slices/orderSlice";
import DashboardReducer from "./slices/dashboardSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    order: OrderReducer,
    wishlist: wishlistReducer,
    shoppingBag: ShoppingBagReducer,
    userOrder: UserOrderReducer,
    dashboard: DashboardReducer,
  },
});

export default store;
