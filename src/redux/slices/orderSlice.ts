import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export interface Order {
  _id?: string;
  product: {
    product: string;
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
  status: "pending" | "processing" | "completed" | "cancelled";
  esewaRefId?: string;
  transactionUuid?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderParams {
  address: {
    country: string;
    city: string;
    street: string;
    secondary?: string;
    postalCode: string;
  };
  mode: 0 | 1;
}

interface EsewaOrderResponse {
  redirect: string;
  transactionUuid: string;
  orderId: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
  pendingEsewaOrder: {
    transactionUuid: string;
    orderId: string;
  } | null;
}

export const createCashOrder = createAsyncThunk<
  Order,
  CreateOrderParams,
  { rejectValue: string }
>("order/createCashOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/order", orderData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to create order");
    }

    toast.success("Order placed successfully!");
    return data.order;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Error creating order";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const createEsewaOrder = createAsyncThunk<
  EsewaOrderResponse,
  CreateOrderParams,
  { rejectValue: string }
>("order/createEsewaOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/order/esewa", orderData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const data = response.data;
    if (!data.success || !data.redirect) {
      throw new Error(data.message || "Failed to create eSewa order");
    }

    toast.success("Redirecting to eSewa payment...");
    return {
      redirect: data.redirect,
      transactionUuid: data.transactionUuid,
      orderId: data.orderId,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error creating eSewa order";
    toast.error(message);
    return rejectWithValue(message);
  }
});

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 9,
  pendingEsewaOrder: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearPendingEsewaOrder: (state) => {
      state.pendingEsewaOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCashOrder.pending, (state) => {
        state.loading = true;
        wydałeś: state.error = null;
      })
      .addCase(
        createCashOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.orders.unshift(action.payload);
          state.currentOrder = action.payload;
          state.total += 1;
          state.pendingEsewaOrder = null;
        }
      )
      .addCase(createCashOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(createEsewaOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEsewaOrder.fulfilled,
        (state, action: PayloadAction<EsewaOrderResponse>) => {
          state.loading = false;
          state.pendingEsewaOrder = {
            transactionUuid: action.payload.transactionUuid,
            orderId: action.payload.orderId,
          };
        }
      )
      .addCase(createEsewaOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {
  clearError,
  resetOrders,
  clearCurrentOrder,
  clearPendingEsewaOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
