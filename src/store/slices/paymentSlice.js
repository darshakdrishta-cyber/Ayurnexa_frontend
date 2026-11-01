import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createCodPayment,
  createUpiPayment,
  newIdempotencyKey,
  listPayments,
  getPayment,
  updatePayment,
  deletePayment,
} from '../../services/payments'

export { newIdempotencyKey }

export const createCodPaymentThunk = createAsyncThunk(
  'payments/createCodPayment',
  async ({ amount, idempotencyKey }, { rejectWithValue }) => {
    try {
      const data = await createCodPayment(amount, idempotencyKey)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'COD payment failed')
    }
  }
)

export const createUpiPaymentThunk = createAsyncThunk(
  'payments/createUpiPayment',
  async ({ amount, customerName, customerEmail, customerContact, idempotencyKey }, { rejectWithValue }) => {
    try {
      const data = await createUpiPayment(
        { amount, customerName, customerEmail, customerContact },
        idempotencyKey
      )
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'UPI payment failed')
    }
  }
)

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (_, { rejectWithValue }) => {
  try {
    const data = await listPayments()
    return data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load payments')
  }
})

export const fetchPayment = createAsyncThunk(
  'payments/fetchPayment',
  async (paymentRecordId, { rejectWithValue }) => {
    try {
      const data = await getPayment(paymentRecordId)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Payment not found')
    }
  }
)

export const updatePaymentThunk = createAsyncThunk(
  'payments/updatePayment',
  async ({ paymentRecordId, payload }, { rejectWithValue }) => {
    try {
      const data = await updatePayment(paymentRecordId, payload)
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update payment')
    }
  }
)

export const deletePaymentThunk = createAsyncThunk(
  'payments/deletePayment',
  async (paymentRecordId, { rejectWithValue }) => {
    try {
      await deletePayment(paymentRecordId)
      return paymentRecordId
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete payment')
    }
  }
)

const initialState = {
  payments: [],
  payment: null,
  loading: false,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.payment = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCodPaymentThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCodPaymentThunk.fulfilled, (state, action) => {
        state.loading = false
        state.payments.unshift(action.payload)
        state.payment = action.payload
      })
      .addCase(createCodPaymentThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createUpiPaymentThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUpiPaymentThunk.fulfilled, (state, action) => {
        state.loading = false
        state.payments.unshift(action.payload)
        state.payment = action.payload
      })
      .addCase(createUpiPaymentThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payment = action.payload
      })
  },
})

export const { clearPayment, clearError: clearPaymentError } = paymentSlice.actions
export default paymentSlice.reducer
