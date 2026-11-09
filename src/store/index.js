import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import paymentReducer from './slices/paymentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['products/uploadImage/fulfilled', 'uploads/uploadImage/fulfilled'],
      },
    }),
})

export default store