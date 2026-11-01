import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import { Button, LinkButton } from './Button'
import { ThemeToggle } from './ThemeToggle'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import logo from '../../assets/AyurnexaWebsiteLogo.png'
import { useCart } from '../../context/CartContext'
import { logoutUser } from '../../store/slices/authSlice'
import { ErrorLogModal } from './ErrorLogModal'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Our story', hash: 'story' },
  { label: 'Categories', hash: 'shop' },
  { label: 'Error log', to: '/error-log' },
]

export function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const { user, token } = useAppSelector((state) => state.auth)
  const { count, items, subtotal, remove } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [errorLogOpen, setErrorLogOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const menuRef = useRef(null)
  const cartRef = useRef(null)

  const isAuthenticated = Boolean(user || token)
  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN' ||
    user?.roles?.includes('ROLE_ADMIN') ||
    user?.roles?.includes('ADMIN')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
    setCartOpen(false)
  }, [pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setMenuOpen(false)
    setOpen(false)
    await dispatch(logoutUser())
    navigate('/')
  }

  const goToHash = (hash) => {
    setOpen(false)
    const scroll = () =>
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (pathname === '/') scroll()
    else navigate('/', { state: { scrollTo: hash } })
  }

  const linkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-primary-700 dark:text-primary-300'
        : 'text-muted-foreground hover:text-foreground'
    }`

  const userInitial = (user?.username || user?.email || 'U').slice(0, 1).toUpperCase()

  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'Account')

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border bg-background/85 backdrop-blur-xl shadow-[0_10px_30px_-24px_rgb(14_21_18/0.5)]'
            : 'border-b border-transparent bg-background/60 backdrop-blur-md'
        }`}
      >
        <div className="container flex h-16 items-center justify-between gap-4 md:h-[70px]">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Ayurnexa home">
            <img src={logo} alt="Ayurnexa" className="h-9 w-9 rounded-xl object-contain" />
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">
              Ayur<span className="text-primary-700 dark:text-primary-300">nexa</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.hash ? (
                <button
                  key={link.label}
                  onClick={() => goToHash(link.hash)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </button>
              ) : (
                <NavLink key={link.label} to={link.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-secondary-500"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                {({ isActive }) => (
                  <>
                    Admin
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-secondary-500"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setErrorLogOpen(true)}
              className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted sm:inline-flex"
            >
              Error log
            </button>
            <ThemeToggle />

            {/* Shopping Bag Button & Dropdown - Always visible to guests and users! */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartOpen((v) => !v)}
                aria-expanded={cartOpen}
                aria-label="Shopping bag"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Bag</span>
                {count > 0 && (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-500 px-1.5 text-[10px] font-extrabold text-white">
                    {count}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-xl"
                  >
                    {items.length === 0 ? (
                      <div className="py-6 text-center">
                        <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground/40" />
                        <p className="mt-2 text-sm text-muted-foreground">Your bag is empty.</p>
                        <button
                          onClick={() => {
                            setCartOpen(false)
                            navigate('/products')
                          }}
                          className="mt-3 text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Browse products →
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 space-y-2 overflow-auto pr-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background p-2.5"
                            >
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                                    {(item.name || 'P')[0]}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-foreground">
                                  {item.name}
                                </span>
                                <span className="block text-[11px] text-muted-foreground">
                                  ₹{item.price} × {item.qty}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground">
                                  ₹{item.price * item.qty}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    remove(item.id)
                                  }}
                                  aria-label={`Remove ${item.name}`}
                                  className="rounded-full p-1 text-muted-foreground transition hover:bg-destructive-50 hover:text-destructive dark:hover:bg-destructive-950/40"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
                          <span>Subtotal</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <button
                          onClick={() => {
                            setCartOpen(false)
                            navigate('/cart')
                          }}
                          className="mt-3 w-full rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                          View bag & checkout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isAuthenticated ? (
              /* When NOT signed in: show Sign In and Get Started buttons */
              <div className="hidden items-center gap-2 sm:flex">
                <LinkButton to="/login" variant="ghost" size="sm">
                  Sign in
                </LinkButton>
                <LinkButton to="/signup" size="sm" className="shadow-none">
                  Get started
                </LinkButton>
              </div>
            ) : (
              /* When signed in: SHOW User Profile Pill */
              <div className="hidden items-center gap-2 sm:flex">
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-expanded={menuOpen}
                    aria-label="User account menu"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-xs font-semibold text-foreground transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-xs font-bold text-white shadow-sm">
                      {user?.picture || user?.avatar || user?.image ? (
                        <img
                          src={user.picture || user.avatar || user.image}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <span className="max-w-[100px] truncate text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                        menuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl"
                      >
                        {/* User Profile Header in Dropdown */}
                        <div className="border-b border-border px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-sm font-bold text-white">
                              {user?.picture || user?.avatar || user?.image ? (
                                <img
                                  src={user.picture || user.avatar || user.image}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                userInitial
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {displayName}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {user?.email || 'Signed in'}
                              </p>
                            </div>
                          </div>
                          {isAdmin ? (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-800 dark:bg-primary-900/40 dark:text-primary-300">
                              <ShieldCheck className="h-3 w-3" /> ADMIN ACCOUNT
                            </span>
                          ) : (
                            <span className="mt-2 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Member Account
                            </span>
                          )}
                        </div>

                        {/* Navigation Options */}
                        <div className="space-y-0.5 py-1">
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/orders')
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                          >
                            <Package className="h-4 w-4 text-muted-foreground" /> My Orders
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/cart')
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                          >
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" /> Shopping Bag
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/products')
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                          >
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" /> Browse Products
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setMenuOpen(false)
                                navigate('/admin')
                              }}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                              <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Admin Panel
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              setErrorLogOpen(true)
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                          >
                            Error log
                          </button>
                        </div>

                        <div className="border-t border-border pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive-50 dark:hover:bg-destructive-950/30"
                          >
                            <LogOut className="h-4 w-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
              aria-label="Mobile"
            >
              <div className="container flex flex-col gap-1 py-4">
                {isAuthenticated && (
                  <div className="mb-2 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-sm font-bold text-white shadow">
                      {user?.picture || user?.avatar || user?.image ? (
                        <img
                          src={user.picture || user.avatar || user.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <span className="rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        ADMIN
                      </span>
                    )}
                  </div>
                )}

                {NAV_LINKS.map((link) =>
                  link.hash ? (
                    <button
                      key={link.label}
                      onClick={() => goToHash(link.hash)}
                      className="rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-foreground transition hover:bg-muted"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      className={({ isActive }) =>
                        `rounded-xl px-3 py-3 text-[15px] font-semibold transition hover:bg-muted ${
                          isActive
                            ? 'bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-200'
                            : 'text-foreground'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-3 text-[15px] font-semibold transition hover:bg-muted ${
                        isActive
                          ? 'bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-200'
                          : 'text-foreground'
                      }`
                    }
                  >
                    Admin panel
                  </NavLink>
                )}

                <NavLink
                  to="/cart"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground transition hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" /> Shopping Bag
                  </span>
                  {count > 0 && (
                    <span className="rounded-full bg-secondary-500 px-2 py-0.5 text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </NavLink>

                {isAuthenticated && (
                  <NavLink
                    to="/orders"
                    className="flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground transition hover:bg-muted"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" /> My Orders
                  </NavLink>
                )}

                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                  {!isAuthenticated ? (
                    <>
                      <LinkButton to="/login" variant="outline" className="w-full">
                        Sign in
                      </LinkButton>
                      <LinkButton to="/signup" className="w-full">
                        Get started
                      </LinkButton>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-center text-destructive hover:bg-destructive-50 dark:hover:bg-destructive-950/30"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <ErrorLogModal open={errorLogOpen} onClose={() => setErrorLogOpen(false)} />
    </>
  )
}

export default Navbar
