import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createCodPayment,
  createUpiPayment,
  newIdempotencyKey,
  verifyPayment,
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
  async (
    { amount, idempotencyKey, orderId, customerName, customerContact, customerEmail },
    { rejectWithValue }
  ) => {
    try {
      const data = await createUpiPayment({
        amount,
        idempotencyKey,
        orderId,
        customerName,
        customerContact,
        customerEmail,
      })
      return data
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.response?.data?.error || 'PayU UPI payment failed'
      )
    }
  }
)

export const verifyPaymentThunk = createAsyncThunk(
  'payments/verifyPayment',
  async (paymentRecordId, { rejectWithValue }) => {
    try {
      const data = await verifyPayment(paymentRecordId)
      return data
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.response?.data?.error || 'PayU payment verification failed'
      )
    }
  }
)

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listPayments()
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load payments')
    }
  }
)

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
      // COD
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

      // PayU UPI
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

      // PayU Verify
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.loading = false
        state.payment = action.payload
        const verifiedId =
          action.payload?.id || action.payload?.paymentRecordId || action.payload?.paymentId
        if (verifiedId) {
          const index = state.payments.findIndex(
            (p) => (p.id || p.paymentRecordId) === verifiedId
          )
          if (index !== -1) {
            state.payments[index] = { ...state.payments[index], ...action.payload }
          }
        }
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch list / single
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
