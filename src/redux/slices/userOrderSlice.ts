import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { IProduct } from "@/interface";

export interface Order {
  _id?: string;
  product: {
    product: IProduct | null;
    quantity: number;
  }[];
  user: string;
  price: number;
  address: {
    country: string;
    city: string;
    street: string;
    secondary?: string;
    postalCode: string;
  };
  mode: 0 | 1;
  status: "processing" | "completed" | "cancelled";
  esewaRefId?: string;
  transactionUuid?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserOrdersState {
  userOrders: Order[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
  statusSummary: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: 0;
  };
}

export const fetchUserOrders = createAsyncThunk<
  {
    orders: Order[];
    page: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
    statusSummary: UserOrdersState["statusSummary"];
  },
  { page?: number; limit?: number },
  { rejectValue: string }
>(
  "userOrders/fetchUserOrders",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/user/order", {
        params: { page, limit },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      const transformedOrders = data.orders.map((order: any) => ({
        ...order,
        product: order.product.map((item: any) => ({
          ...item,
          product:
            item.product && typeof item.product === "object"
              ? item.product
              : null,
        })),
      }));

      return {
        orders: transformedOrders,
        page: data.page,
        totalPages: data.totalPages,
        totalOrders: data.totalOrders,
        limit: data.limit,
        statusSummary: data.statusSummary,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error fetching orders";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState: UserOrdersState = {
  userOrders: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 9,
  statusSummary: {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  },
};

const userOrdersSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
      state.statusSummary = {
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: Order[];
            page: number;
            totalPages: number;
            totalOrders: number;
            limit: number;
            statusSummary: UserOrdersState["statusSummary"];
          }>
        ) => {
          state.loading = false;
          state.userOrders = action.payload.orders;
          state.page = action.payload.page;
          state.total = action.payload.totalOrders;
          state.totalPages = action.payload.totalPages;
          state.limit = action.payload.limit;
          state.statusSummary = action.payload.statusSummary;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { clearError, clearUserOrders } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
