import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: number;
  wishlist: string[];
  shoppingBag: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginParams {
  credentials: { email: string; password: string };
  rememberMe: boolean;
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

export const fetchUserDetails = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/fetchUserDetails", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/user/user-details/${email}`, {
      withCredentials: true,
    });
    const user = response.data.user;

    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    }

    return user;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch user details";
    toast.error(errorMsg);
    return rejectWithValue(errorMsg);
  }
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ credentials, rememberMe }: LoginParams, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      const { token, user } = response.data;
      toast.success(response.data.message);

      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }
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

      const token = response.data.token;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", token);
      }

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
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
    setTokenFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          state.token = token;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAdminAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkAdminAuth.fulfilled,
        (state, action: PayloadAction<{ isAdmin: boolean }>) => {
          state.isAdmin = action.payload.isAdmin;
          state.loading = false;
        }
      )
      .addCase(checkAdminAuth.rejected, (state) => {
        state.isAdmin = false;
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
        state.error = action.payload || null;
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

export const { logout, setTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;
