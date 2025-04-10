import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
}

interface FetchCategoryParams {
  page?: number;
  limit?: number;
}

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async ({ page = 1, limit = 8 }: FetchCategoryParams) => {
    try {
      const res = await axios.get(`/api/category?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return Promise.reject(error.message || "Error fetching categories");
    }
  }
);

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 8,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action: PayloadAction<any>) => {
        state.categories = action.payload.Categories;
        state.total = action.payload.total;
        state.totalPages = action.payload.pages;
        state.page = action.payload.page;
        state.loading = false;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch categories";
        toast.error(state.error);
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
