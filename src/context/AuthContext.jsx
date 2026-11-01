import { createContext, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { logoutUser, setCredentials } from '../store/slices/authSlice'
import { getStoredUser, setStoredUser, removeStoredUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const reduxAuth = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const user = reduxAuth.user || getStoredUser()

  const login = (userData) => {
    setStoredUser(userData)
    dispatch(setCredentials({ user: userData }))
  }

  const logout = () => {
    removeStoredUser()
    dispatch(logoutUser())
  }

  const value = {
    user,
    loading: reduxAuth.loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
