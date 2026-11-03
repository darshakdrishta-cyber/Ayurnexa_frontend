import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { appConfig } from './config'
import { store } from './store'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ProductsPage, { ProductDetail, OrderTrackPage } from './pages/Products'
import CartPage from './pages/Cart'
import AdminLayout from './components/admin/AdminLayout'
import { AdminOrders } from './components/admin/OrdersPage'
import { AdminProducts } from './components/admin/ProductsPage'
import { AddProductForm } from './components/admin/AddProductForm'
import { isAdminUser } from './services/auth'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { fetchMe } from './store/slices/authSlice'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function GuestOnly({ children }) {
  const { user, token, loading } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)
  if (loading && !isAuthenticated) return null
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function AuthRequired({ children }) {
  const { user, token, loading } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)
  if (loading && !isAuthenticated) return null
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRequired({ children }) {
  const { user, token, loading } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isAdminUser(user) ? children : <Navigate to="/" replace />
}

function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    // Validate the stored bearer token on mount.
    dispatch(fetchMe())
      .unwrap()
      .then((meData) => {
        if (meData && ['/login', '/signup'].includes(pathnameRef.current)) {
          navigate('/', { replace: true })
        }
      })
      .catch(() => {
        // Guest user or invalid session
      })
  }, [dispatch, navigate])

  return null
}

function AppShell() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<AuthRequired><OrderTrackPage /></AuthRequired>} />
            <Route path="/admin" element={
              <AdminRequired>
                <AdminLayout><AdminOrders /></AdminLayout>
              </AdminRequired>
            } />
            <Route path="/admin/orders" element={
              <AdminRequired>
                <AdminLayout><AdminOrders /></AdminLayout>
              </AdminRequired>
            } />
            <Route path="/admin/products" element={
              <AdminRequired>
                <AdminLayout><AdminProducts /></AdminLayout>
              </AdminRequired>
            } />
            <Route path="/admin/products/add" element={
              <AdminRequired>
                <AdminLayout><AddProductForm /></AdminLayout>
              </AdminRequired>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <GoogleOAuthProvider clientId={appConfig.googleClientId}>
              <AppShell />
            </GoogleOAuthProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
