import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Trash2, Power, CheckCircle2 } from 'lucide-react'
import { LinkButton } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Reveal } from '../../components/common/Reveal'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import {
  fetchAllProducts,
  toggleProductThunk,
  deleteProductThunk,
} from '../../store/slices/productSlice'

export function AdminProducts() {
  const dispatch = useAppDispatch()
  const { allProducts, loading } = useAppSelector((state) => state.products)
  const [query, setQuery] = useState('')

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const visible = allProducts.filter(
    (p) =>
      !query ||
      (p.productName || p.name || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container py-8">
      <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage the catalog, toggle visibility and remove items.</p>
        </div>
        <LinkButton to="/admin/products/add" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add product
        </LinkButton>
      </Reveal>

      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Product</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Category</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary-600" /> Loading products…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">No products found.</td>
                </tr>
              ) : (
                visible.map((product) => {
                  const isActive = product.isActive !== false
                  return (
                    <motion.tr
                      key={product.productId || product.id}
                      whileHover={{ bg: 'muted/30' }}
                      className="border-b border-border group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 font-bold text-sm">
                            {(product.productName || product.name || 'P').slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {product.productName || product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.form} · {product.productWeight || product.weight || ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">
                        {product.productCategory || product.category}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-foreground">
                        ₹{Number(product.productPrice ?? product.price ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => dispatch(toggleProductThunk(product.productId || product.id))}
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors ${
                            isActive
                              ? 'text-success border-success-200 bg-success-50 hover:bg-success-100'
                              : 'text-destructive border-destructive-200 bg-destructive-50 hover:bg-destructive-100'
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> : <Power className="h-3.5 w-3.5 mr-1.5" />}
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => dispatch(deleteProductThunk(product.productId || product.id))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-destructive text-xs transition hover:bg-destructive-50"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
