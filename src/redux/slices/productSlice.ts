import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

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
  shipping?: boolean;
}

interface ProductState {
  products: Product[];
  singleProduct: Product | null;
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
      const res = await axios.get(`/api/product/${slug}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return Promise.reject(error.message || "Error fetching product");
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
  reducers: {},
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
      });
  },
});

export default productSlice.reducer;
