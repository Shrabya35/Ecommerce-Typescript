import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface DashboardData {
  revenue: {
    total: number;
    monthly: {
      labels: string[];
      values: number[];
    };
  };
  paymentModes: {
    cod: number;
    esewa: number;
  };
  orderStatus: {
    labels: string[];
    completed: number[];
    cancelled: number[];
  };
  topCategories: { [key: string]: number };
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/dashboard", {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching dashboard data";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Failed to fetch dashboard data";
        state.loading = false;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
