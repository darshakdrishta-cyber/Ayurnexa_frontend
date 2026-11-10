import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Package,
  Plus,
  Tag,
  LogOut,
  ShieldCheck,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: BarChart3 },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Add Product', to: '/admin/products/add', icon: Plus },
  { label: 'Offers', to: '/admin/offers', icon: Tag },
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-width duration-300 overflow-hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-900 text-sm font-extrabold text-white shadow-sm">
              A
            </span>
            <span className="font-display font-semibold tracking-tight text-foreground">
              Ayur<span className="text-primary-700 dark:text-primary-300">nexa</span>
            </span>
          </Link>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted"
            aria-label="Collapse navigation"
          >
            <span className="h-[1px] w-5 bg-current" />
          </button>
        </div>
        <div className="flex h-full flex-col py-6">
          <div className="mx-4 mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="h-px w-6 bg-primary-200" /> Navigation
          </div>
          <div className="space-y-1 px-3">
            {NAV.map((item) => {
            return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive: active }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.label}
                </NavLink>
              )
            })}
          </div>
          <div className="mt-auto px-4 pb-6 border-t border-border">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              {user?.username || user?.email} <br />
              <span className="text-[10px] bg-primary-100/60 text-primary-700 px-2 py-0.5 rounded">ADMIN</span>
            </p>
          </div>
        </div>
      </nav>

      <div className={`ml-[${collapsed ? 0 : 64}px] transition-margin duration-300`}>
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-semibold text-foreground">Admin panel</h1>
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            <div className="flex items-center gap-3">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">
                Visit store
              </Link>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
