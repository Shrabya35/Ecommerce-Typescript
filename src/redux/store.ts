import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import wishlistReducer from "./slices/wishlistSlice";
import ShoppingBagReducer from "./slices/shoppingBagSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    wishlist: wishlistReducer,
    shoppingBag: ShoppingBagReducer,
  },
});

export default store;
