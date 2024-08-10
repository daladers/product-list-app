import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  products: [],
  currentProduct: null,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data.map((product) => ({
      ...product,
      id: product._id,
    }));
  }
);

export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async (id) => {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      return { ...response.data, id: response.data._id };
    }
  );
  
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product) => {
    const response = await axios.post(`${API_URL}/api/products`, product);
    return { ...response.data, id: response.data._id };
  }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async (product) => {
      try {
        const response = await axios.put(
          `${API_URL}/api/products/${product.id}`,
          product
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  );
  

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    await axios.delete(`${API_URL}/api/products/${id}`);
    return id;
  }
);

export const addComment = createAsyncThunk(
    "product/addComment",
    async ({ productId, comment }) => {
      const response = await axios.post(
        `${API_URL}/api/products/${productId}/comments`,
        comment
      );
      return { productId, comment: response.data };
    }
  );

  export const deleteComment = createAsyncThunk(
    "product/deleteComment",
    async ({ productId, commentId }) => {
      await axios.delete(
        `${API_URL}/api/products/${productId}/comments/${commentId}`
      );
      return { productId, commentId };
    }
  );
  

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        const product = { ...action.payload, id: action.payload._id };
        state.products.push(product);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { productId, comment } = action.payload;
        const product = state.products.find(p => p.id === productId);
        if (product) {
          product.comments.push(comment);
        }
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.comments.push(comment);
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { productId, commentId } = action.payload;
        const product = state.products.find(p => p.id === productId);
        if (product) {
          product.comments = product.comments.filter(c => c._id !== commentId);
        }
        if (state.currentProduct && state.currentProduct.id === productId) {
          state.currentProduct.comments = state.currentProduct.comments.filter(c => c._id !== commentId);
        }
      });
  },
});

export const { setCurrentProduct } = productSlice.actions;

export default productSlice.reducer;
