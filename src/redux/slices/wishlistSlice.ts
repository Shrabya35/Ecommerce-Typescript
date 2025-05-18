import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { IProduct } from "@/interface";

interface WishlistState {
  wishlist: IProduct[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FetchWishlistParams {
  page?: number;
  limit?: number;
}

interface AddToWishlistParams {
  productId: string;
}

interface RemoveFromWishlistParams {
  productId: string;
}

const handleApiError = (error: any, defaultMessage: string) => {
  const errorMsg = error.response?.data?.message || defaultMessage;
  toast.error(errorMsg);
  return errorMsg;
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (
    { page = 1, limit = 10 }: FetchWishlistParams,
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get<{
        success: boolean;
        wishlist: IProduct[];
        total: number;
        totalPages: number;
      }>(`/api/user/wishlist?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });

      const wishlistItems = Array.isArray(res.data.wishlist)
        ? res.data.wishlist
        : [];

      return {
        items: wishlistItems,
        page,
        total: res.data.total || wishlistItems.length,
        totalPages:
          res.data.totalPages || Math.ceil(wishlistItems.length / limit),
      };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Error fetching wishlist"));
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId }: AddToWishlistParams, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post<{
        success: boolean;
        message: string;
        product: IProduct;
      }>(
        `/api/user/wishlist`,
        { productId },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Added to wishlist");

      dispatch(fetchWishlist({ page: 1, limit: 10 }));

      return res.data.product;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to add item to wishlist")
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId }: RemoveFromWishlistParams, { rejectWithValue }) => {
    try {
      const res = await axios.put<{
        success: boolean;
        message: string;
        product: IProduct;
      }>(
        `/api/user/wishlist`,
        { productId },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Removed from wishlist");
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to remove item from wishlist")
      );
    }
  }
);

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<IProduct[]>) => {
      state.wishlist = action.payload;
      state.total = action.payload.length;
      state.loading = false;
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: IProduct[];
            page: number;
            total: number;
            totalPages: number;
          }>
        ) => {
          state.wishlist = action.payload.items;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.totalPages = action.payload.totalPages;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch wishlist";
      })

      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          if (!state.wishlist.some((item) => item._id === action.payload._id)) {
            state.wishlist.push(action.payload);
            state.total += 1;
            state.totalPages = Math.ceil(state.total / state.limit);
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to add to wishlist";
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.wishlist = state.wishlist.filter(
            (item) => item._id !== action.payload
          );
          state.total = Math.max(0, state.total - 1);
          state.totalPages = Math.max(1, Math.ceil(state.total / state.limit));
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to remove from wishlist";
      });
  },
});

export const { setWishlistItems, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
