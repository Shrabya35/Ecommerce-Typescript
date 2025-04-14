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
interface AddCategoryParams {
  name: string;
}
interface UpdateCategoryParams {
  id: string;
  name: string;
}
interface DeleteCategoryParams {
  id: string;
}
export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async ({ page = 1, limit = 10 }: FetchCategoryParams) => {
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

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ name }: AddCategoryParams, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/category`,
        { name },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      return res.data.category;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Error creating category";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name }: UpdateCategoryParams, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/category/${id}`,
        { name },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      return res.data.category;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Error updating category";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({ id }: DeleteCategoryParams, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      return id;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Error deleting category";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
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
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.categories = [action.payload, ...state.categories];
          state.total += 1;
          state.loading = false;
        }
      )
      .addCase(addCategory.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to create category";
        state.loading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.categories = state.categories.map((cat) =>
            cat._id === action.payload._id ? action.payload : cat
          );
          state.loading = false;
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update category";
        state.loading = false;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.categories = state.categories.filter(
            (cat) => cat._id !== action.payload
          );
          state.total -= 1;
          state.loading = false;
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete category";
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
