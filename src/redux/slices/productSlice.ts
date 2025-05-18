import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IProduct } from "@/interface";
import { toast } from "react-toastify";

interface ProductState {
  products: IProduct[];
  singleProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  limit: number;
}

interface FetchProductParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  onSale?: boolean;
  sort?: "latest" | "oldest";
  price?: "low" | "high";
}
interface DeleteProductParams {
  id: string;
}

interface FetchSingleProductParams {
  slug: string;
}

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async ({
    page = 1,
    limit = 9,
    category,
    type,
    onSale,
    sort,
    price,
  }: FetchProductParams) => {
    try {
      let query = `/api/product?page=${page}&limit=${limit}`;

      if (category) {
        query += `&category=${category}`;
      }

      if (type) {
        query += `&type=${type}`;
      }

      if (onSale !== undefined) {
        query += `&onSale=${onSale}`;
      }

      if (sort) {
        query += `&sort=${sort}`;
      }

      if (price) {
        query += `&price=${price}`;
      }
      const res = await axios.get(query, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return Promise.reject(error.message || "Error fetching products");
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async ({ slug }: FetchSingleProductParams) => {
    try {
      const res = await axios.get(`/api/product/slug/${slug}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return Promise.reject(error.message || "Error fetching product");
    }
  }
);
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(res.data.message);
      return res.data.product;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error || error.message || "Error adding product";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(res.data.message);
      return res.data.product;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error ||
        error.message ||
        "Error updating product";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async ({ id }: DeleteProductParams, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/product/${id}`, {
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

const initialState: ProductState = {
  products: [],
  singleProduct: null,
  loading: false,
  error: null,
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 9,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.products = [];
      state.singleProduct = null;
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.pages;
        state.page = action.payload.page;
        state.loading = false;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch products";
        toast.error(state.error);
        state.loading = false;
      })
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSingleProduct.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.singleProduct = action.payload.product;
          state.loading = false;
        }
      )
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch product";
        toast.error(state.error);
        state.loading = false;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.products.unshift(action.payload);
          state.total += 1;
          state.loading = false;
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to add product";
        state.loading = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.products = state.products.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
          if (state.singleProduct?._id === action.payload._id) {
            state.singleProduct = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update product";
        state.loading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
          state.total -= 1;
          state.loading = false;
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete Product";
        state.loading = false;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
