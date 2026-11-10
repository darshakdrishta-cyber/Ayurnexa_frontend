import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getAdminOrders,
  updateAdminOrderQuickStatus,
} from '../../services/orders'

export const ORDER_STEPS = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED']

export const ORDER_STEP_LABELS = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await listOrders()
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load orders')
  }
})

export const fetchAdminOrdersThunk = createAsyncThunk('orders/fetchAdminOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getAdminOrders()
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load admin orders')
  }
})

export const updateAdminOrderStatusThunk = createAsyncThunk(
  'orders/updateAdminOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const data = await updateAdminOrderQuickStatus(orderId, status)
      return { orderId, status, data }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update order status')
    }
  }
)

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (orderId, { rejectWithValue }) => {
  try {
    const data = await getOrder(orderId)
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Order not found')
  }
})

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async ({ paymentId, items, expectedDeliveryDate }, { rejectWithValue }) => {
    try {
      const data = await createOrder({ paymentId, items, expectedDeliveryDate })
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create order')
    }
  }
)

export const updateOrderThunk = createAsyncThunk(
  'orders/updateOrder',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateOrder(orderId, payload)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update order')
    }
  }
)

export const deleteOrderThunk = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await deleteOrder(orderId)
      return orderId
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete order')
    }
  }
)

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.order = action.payload
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders.unshift(action.payload)
      })
      .addCase(updateOrderThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id || o.orderId === action.payload.orderId)
        if (index !== -1) state.orders[index] = action.payload
        if (state.order && (state.order.id === action.payload.id || state.order.orderId === action.payload.orderId)) {
          state.order = action.payload
        }
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload && o.orderId !== action.payload)
      })
      .addCase(fetchAdminOrdersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdminOrdersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchAdminOrdersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateAdminOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, status, data } = action.payload
        const index = state.orders.findIndex((o) => (o.orderId || o.id) === orderId)
        if (index !== -1) {
          const prevOrder = state.orders[index]
          state.orders[index] = {
            ...prevOrder,
            ...(data && typeof data === 'object' ? data : {}),
            // Preserve user info if the status update response didn't return or populate the nested user
            user: (data && data.user) || prevOrder.user,
            customerName: (data && data.customerName) || prevOrder.customerName,
            email: (data && data.email) || prevOrder.email,
            orderStatus: status,
            orderProgress: status,
          }
        }
      })
  },
})

export const { clearOrder, clearError: clearOrderError } = orderSlice.actions
export default orderSlice.reducer
