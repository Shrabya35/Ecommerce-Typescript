import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { IProduct } from "@/interface";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id?: string;
  product: {
    product: IProduct | null;
    quantity: number;
  }[];
  user: User;
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

interface ChangeStatusParams {
  orderId: string;
  newStatus: "completed" | "cancelled";
}

interface OrderState {
  orders: Order[];
  processingOrders: Order[];
  completedOrders: Order[];
  cancelledOrders: Order[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  processingTotal: number;
  completedTotal: number;
  cancelledTotal: number;
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

export const getOrders = createAsyncThunk<
  OrderState,
  { page: number; limit?: number },
  { rejectValue: string }
>("order/getOrders", async ({ page, limit = 9 }, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/order", {
      params: { page, limit },
      withCredentials: true,
    });

    const data = response.data.data;
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch orders");
    }

    return {
      orders: data.orders,
      processingOrders: data.processingOrders,
      completedOrders: data.completedOrders,
      cancelledOrders: data.cancelledOrders,
      loading: false,
      error: null,
      page: data.page,
      total: data.totalData,
      processingTotal: data.totals.processing,
      completedTotal: data.totals.completed,
      cancelledTotal: data.totals.cancelled,
      totalPages: data.totalPages,
      limit,
      pendingEsewaOrder: null,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Error fetching orders";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const changeOrderStatus = createAsyncThunk<
  Order,
  ChangeStatusParams,
  { rejectValue: string }
>(
  "order/changeOrderStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/order/${orderId}`,
        { status: newStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to update order status");
      }

      toast.success(data.message || "Order status updated successfully!");
      return data.data.order;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error updating order status";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState: OrderState = {
  orders: [],
  processingOrders: [],
  completedOrders: [],
  cancelledOrders: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  processingTotal: 0,
  completedTotal: 0,
  cancelledTotal: 0,
  totalPages: 0,
  limit: 15,
  pendingEsewaOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orders = [];
      state.processingOrders = [];
      state.completedOrders = [];
      state.cancelledOrders = [];
      state.page = 1;
      state.total = 0;
      state.processingTotal = 0;
      state.completedTotal = 0;
      state.cancelledTotal = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCashOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCashOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.orders.unshift(action.payload);
          state.total += 1;
          if (action.payload.status === "processing") {
            state.processingOrders.unshift(action.payload);
            state.processingTotal += 1;
          }
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
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.processingOrders = action.payload.processingOrders;
        state.completedOrders = action.payload.completedOrders;
        state.cancelledOrders = action.payload.cancelledOrders;
        state.page = action.payload.page;
        state.total = action.payload.total;
        state.processingTotal = action.payload.processingTotal;
        state.completedTotal = action.payload.completedTotal;
        state.cancelledTotal = action.payload.cancelledTotal;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
        state.pendingEsewaOrder = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changeOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.error = null;

          const updatedOrder = action.payload;
          const orderIndex = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (orderIndex !== -1) {
            state.orders[orderIndex] = updatedOrder;
          }

          state.processingOrders = state.processingOrders.filter(
            (order) => order._id !== updatedOrder._id
          );
          state.processingTotal -= 1;

          if (updatedOrder.status === "completed") {
            state.completedOrders.unshift(updatedOrder);
            state.completedTotal += 1;
          } else if (updatedOrder.status === "cancelled") {
            state.cancelledOrders.unshift(updatedOrder);
            state.cancelledTotal += 1;
          }
        }
      )
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
