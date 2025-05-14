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
  category: string | { name: string; _id: string; __v?: number };
  quantity: number;
  image?: {
    data: string;
    contentType: string;
  };
}

interface bagItem {
  product: Product;
  quantity: number;
}
interface bagState {
  bag: bagItem[];
  loading: boolean;
  error: string | null;
  subtotal: number;
  estimatedShipping: number;
  totalPrice: number;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FetchBagParams {
  page?: number;
  limit?: number;
}

interface UpdateBagParams {
  productId: string;
}

interface updateQuantityParams {
  productId: string;
  action: 0 | 1;
}

const handleApiError = (error: any, defaultMessage: string) => {
  const errorMsg = error.response?.data?.message || defaultMessage;
  toast.error(errorMsg);
  return errorMsg;
};

export const fetchBag = createAsyncThunk(
  "shoppingBag/fetchBag",
  async ({ page = 1, limit = 10 }: FetchBagParams, { rejectWithValue }) => {
    try {
      const res = await axios.get<{
        message: string;
        shoppingBag: bagItem[];
        subtotal: number;
        estimatedShipping: number;
        totalPrice: number;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/api/user/shoppingBag?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });

      const bagItems = Array.isArray(res.data.shoppingBag)
        ? res.data.shoppingBag
        : [];

      return {
        items: bagItems,
        subtotal: res.data.subtotal || 0,
        estimatedShipping: res.data.estimatedShipping || 0,
        totalPrice: res.data.totalPrice || 0,
        page: res.data.page || page,
        total: res.data.total || bagItems.length,
        totalPages: res.data.totalPages || 1,
      };
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Error fetching shopping bag")
      );
    }
  }
);

export const addToBag = createAsyncThunk(
  "shoppingBag/addToBag",
  async ({ productId }: UpdateBagParams, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post<{
        message: string;
        item: {
          product: Product;
          quantity: number;
        };
      }>(
        `/api/user/shoppingBag`,
        { productId },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Added to bag");

      dispatch(fetchBag({ page: 1, limit: 10 }));

      return res.data.item;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to add item to bag")
      );
    }
  }
);

export const removeFromBag = createAsyncThunk(
  "shoppingBag/removeFromBag",
  async ({ productId }: UpdateBagParams, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put<{
        message: string;
        item: {
          product: Product;
          quantity: number;
        };
      }>(
        `/api/user/shoppingBag`,
        { productId },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Removed to bag");

      dispatch(fetchBag({ page: 1, limit: 10 }));

      return res.data.item;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to add item to bag")
      );
    }
  }
);

export const updateBagQuantity = createAsyncThunk(
  "shoppingBag/updateBagQuantity",
  async (
    { productId, action }: updateQuantityParams,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axios.patch<{
        message: string;
        shoppingBag: bagItem[];
      }>(
        `/api/user/shoppingBag`,
        { productId, action },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Quantity updated");

      dispatch(fetchBag({ page: 1, limit: 10 }));

      return res.data.shoppingBag;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to update item quantity")
      );
    }
  }
);

const initialState: bagState = {
  bag: [],
  loading: false,
  error: null,
  subtotal: 0,
  estimatedShipping: 0,
  totalPrice: 0,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const shoppingBagSlice = createSlice({
  name: "shoppingBag",
  initialState,
  reducers: {
    setBagItems: (state, action: PayloadAction<bagItem[]>) => {
      state.bag = action.payload;
      state.total = action.payload.length;
      state.loading = false;
      state.error = null;
    },

    clearBag: (state) => {
      state.bag = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBag.fulfilled, (state, action) => {
        state.loading = false;
        state.bag = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.estimatedShipping = action.payload.estimatedShipping;
        state.totalPrice = action.payload.totalPrice;
        state.page = action.payload.page;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchBag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToBag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToBag.fulfilled, (state, action: PayloadAction<bagItem>) => {
        const exists = state.bag.find(
          (item) => item.product._id === action.payload.product._id
        );

        if (!exists) {
          state.bag.push(action.payload);
        } else {
          exists.quantity = action.payload.quantity;
        }

        state.total = state.bag.length;
        state.totalPages = Math.ceil(state.total / state.limit);
        state.loading = false;
        state.error = null;
      })
      .addCase(addToBag.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to add to Shopping Bag";
      })
      .addCase(removeFromBag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFromBag.fulfilled,
        (
          state,
          action: PayloadAction<{ product: Product; quantity: number }>
        ) => {
          state.bag = state.bag.filter(
            (item) => item.product._id !== action.payload.product._id
          );
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(removeFromBag.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to remove from wishlist";
      })
      .addCase(updateBagQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBagQuantity.fulfilled,
        (state, action: PayloadAction<bagItem[]>) => {
          action.payload.forEach((updatedItem) => {
            const existingItem = state.bag.find(
              (item) => item.product === updatedItem.product
            );
            if (existingItem) {
              existingItem.quantity = updatedItem.quantity;
            }
          });

          state.total = state.bag.length;
          state.totalPages = Math.ceil(state.total / state.limit) || 1;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(updateBagQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update item quantity";
      });
  },
});

export const { setBagItems, clearBag } = shoppingBagSlice.actions;
export default shoppingBagSlice.reducer;
