import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setWishlistItems } from "./wishlistSlice";
import { setBagItems } from "./shoppingBagSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: number;
  wishlist: Product[];
  shoppingBag: string[];
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
  category: string;
  quantity: number;
  image?: {
    data: string;
    contentType: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginParams {
  credentials: { email: string; password: string; rememberMe: boolean };
}

interface RegisterParams {
  userData: { name: string; email: string; password: string; phone: string };
  confirmPassword: string;
}

export const checkAdminAuth = createAsyncThunk("auth/checkAdmin", async () => {
  try {
    const res = await axios.get("/api/auth/admin-auth", {
      withCredentials: true,
    });
    return { isAdmin: res.data.ok };
  } catch (error) {
    return { isAdmin: false };
  }
});

export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.get<{ success: boolean; user: User }>(
        "/api/auth/user",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        if (res.data.user.wishlist && res.data.user.wishlist.length > 0) {
          dispatch(setWishlistItems(res.data.user.wishlist));
        }
        if (res.data.user.shoppingBag && res.data.user.shoppingBag.length > 0) {
          const bagItems = res.data.user.shoppingBag.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
          }));
          dispatch(setBagItems(bagItems));
        }
        return res.data.user;
      } else {
        return rejectWithValue("User not authorized");
      }
    } catch (error) {
      return rejectWithValue("Error fetching user");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ credentials }: LoginParams, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      toast.success(response.data.message);

      if (response.data.user && response.data.user.wishlist) {
        dispatch(setWishlistItems(response.data.user.wishlist));
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    { userData, confirmPassword }: RegisterParams,
    { rejectWithValue }
  ) => {
    try {
      if (confirmPassword !== userData.password) {
        toast.error("Password did not match");
        return rejectWithValue("Password does not match");
      }
      const response = await axios.post("/api/auth/register", userData, {
        withCredentials: true,
      });
      toast.success(response.data.message);

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isAdmin: false,
  authChecked: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAdmin = false;
      state.error = null;

      if (typeof document !== "undefined") {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        checkAdminAuth.fulfilled,
        (state, action: PayloadAction<{ isAdmin: boolean }>) => {
          state.isAdmin = action.payload.isAdmin;
          state.authChecked = true;
          state.loading = false;
        }
      )
      .addCase(checkAdminAuth.rejected, (state) => {
        state.isAdmin = false;
        state.authChecked = true;
        state.loading = false;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string" ? action.payload : null;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.user = null;
        state.token = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.user = null;
        state.token = null;
      });
  },
});

export const readTokenFromCookie = () => (dispatch: any) => {
  if (typeof document !== "undefined") {
    const cookieParts = document.cookie.split("; ");

    const tokenCookie = cookieParts.find((row) => row.startsWith("token="));

    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      dispatch(authSlice.actions.setToken(token));
    }
  } else {
    console.log("Document is undefined - running in non-browser environment");
  }
};

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
