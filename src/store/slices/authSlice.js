import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  login as loginRequest,
  register as registerRequest,
  googleLogin as googleLoginRequest,
  me,
  logout,
  clearSession,
  getStoredUser,
  setStoredUser,
  getToken,
  setToken,
  normalizeUser,
} from '../../services/auth'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginRequest({ email, password })
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Login failed'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      return await registerRequest({ username, email, password })
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Signup failed'
      )
    }
  }
)

export const googleLoginUser = createAsyncThunk(
  'auth/googleLoginUser',
  async ({ credential }, { rejectWithValue }) => {
    try {
      return await googleLoginRequest({ credential })
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Google sign in failed'
      )
    }
  }
)

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await me()
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.message || error?.response?.data?.error || 'Session load failed'
    )
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await logout()
  } finally {
    clearSession()
  }
})

const initialUser = getStoredUser()
const initialToken = getToken()

const initialState = {
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,
  isAuthenticated: Boolean(initialUser || initialToken),
}

function handleAuthSuccess(state, action) {
  state.loading = false
  state.error = null

  const payload = action.payload || {}
  const token =
    payload.token ||
    payload.accessToken ||
    payload.jwt ||
    payload.data?.token ||
    payload.data?.accessToken ||
    state.token ||
    getToken()

  const rawUser =
    payload.user || payload.data?.user || (payload.email ? payload : null) || state.user
  const user = normalizeUser(rawUser)

  state.token = token || null
  state.user = user || null
  state.isAuthenticated = Boolean(state.user || state.token)

  if (token) setToken(token)
  if (user) setStoredUser(user)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload || {}
      if (token) {
        state.token = token
        setToken(token)
      }
      if (user) {
        state.user = normalizeUser(user)
        setStoredUser(state.user)
      }
      state.isAuthenticated = Boolean(state.user || state.token)
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearSession()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload?.token || action.payload?.user) {
          handleAuthSuccess(state, action)
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Google Sign-In
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action)
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch current session (supports Bearer token & HttpOnly cookie)
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload || {}
        const user = normalizeUser({
          ...(state.user || {}),
          ...payload,
          picture: state.user?.picture || payload?.picture,
        })
        state.user = user
        state.isAuthenticated = Boolean(user)
        if (user) setStoredUser(user)
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearSession()
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
      })
  },
})

export const { setCredentials, clearAuth, clearError } = authSlice.actions
export default authSlice.reducer
