import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  listProducts,
  listAllProducts,
  getProduct,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
  uploadImage,
} from '../../services/products'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const data = await listProducts()
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load products')
  }
})

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listAllProducts()
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load products')
    }
  }
)

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId, { rejectWithValue }) => {
  try {
    const data = await getProduct(productId)
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Product not found')
  }
})

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async ({ name }, { rejectWithValue }) => {
    try {
      const data = await searchProducts(name)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Search failed')
    }
  }
)

export const createProductThunk = createAsyncThunk(
  'products/createProduct',
  async ({ payload }, { rejectWithValue }) => {
    try {
      const data = await createProduct(payload)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create product')
    }
  }
)

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateProduct(productId, payload)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update product')
    }
  }
)

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProduct(productId)
      return productId
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete product')
    }
  }
)

export const toggleProductThunk = createAsyncThunk(
  'products/toggleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await toggleProduct(productId)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Toggle failed')
    }
  }
)

export const uploadImageThunk = createAsyncThunk(
  'products/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const data = await uploadImage(file)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Upload failed')
    }
  }
)

const initialState = {
  products: [],
  product: null,
  allProducts: [],
  searchResults: [],
  loading: false,
  error: null,
  upload: { loading: false, url: null, error: null },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null
    },
    clearError: (state) => {
      state.error = null
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload)
        state.allProducts.push(action.payload)
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.productId === action.payload.productId || p.id === action.payload.id)
        if (index !== -1) state.products[index] = action.payload
        const allIndex = state.allProducts.findIndex((p) => p.productId === action.payload.productId || p.id === action.payload.id)
        if (allIndex !== -1) state.allProducts[allIndex] = action.payload
        if (state.product && (state.product.productId === action.payload.productId || state.product.id === action.payload.id)) {
          state.product = action.payload
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.productId !== action.payload && p.id !== action.payload)
        state.allProducts = state.allProducts.filter((p) => p.productId !== action.payload && p.id !== action.payload)
      })
      .addCase(toggleProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.productId === action.payload.productId || p.id === action.payload.id)
        if (index !== -1) state.products[index] = action.payload
        const allIndex = state.allProducts.findIndex((p) => p.productId === action.payload.productId || p.id === action.payload.id)
        if (allIndex !== -1) state.allProducts[allIndex] = action.payload
      })
      .addCase(uploadImageThunk.pending, (state) => {
        state.upload.loading = true
        state.upload.url = null
        state.upload.error = null
      })
      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        state.upload.loading = false
        state.upload.url = action.payload.url
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.upload.loading = false
        state.upload.error = action.payload
      })
  },
})

export const { clearProduct, clearError: clearProductError, setSearchResults } = productSlice.actions
export default productSlice.reducer
