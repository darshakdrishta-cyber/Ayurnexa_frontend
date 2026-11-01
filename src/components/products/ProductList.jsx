import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingBag } from 'lucide-react'
import { Button, LinkButton } from '../common/Button'
import { Reveal } from '../common/Reveal'
import { ProductCard } from '../landing/Shop'
import { useCart } from '../../context/CartContext'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchProducts, searchProductsThunk, clearProduct } from '../../store/slices/productSlice'
import { CATEGORY_LABEL } from '../../data/products'

export function ProductList() {
  const dispatch = useAppDispatch()
  useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const { products, loading, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
    return () => dispatch(clearProduct())
  }, [dispatch])

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchProductsThunk({ name: query }))
      const params = new URLSearchParams(searchParams)
      params.set('search', query)
      setSearchParams(params, { replace: true })
    }
  }, [query, dispatch, searchParams])

  const productSource = useMemo(() => {
    return products && products.length > 0 ? products : []
  }, [products, loading])

  const visible = useMemo(() => {
    let list = productSource
    if (category !== 'all') {
      list = list.filter((p) => (p.productCategory || p.category) === category)
    }
    if (query.trim() && !productSource.length) return list
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          (p.productName || p.name || '').toLowerCase().includes(q) ||
          (p.productDescription || p.desc || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [productSource, category, query])

  const categories = useMemo(() => {
    const set = new Set(['all'])
    productSource.forEach((p) => set.add(p.productCategory || p.category || 'wellness'))
    return [...set]
  }, [productSource])

  const setCategoryFilter = (id) => {
    const params = new URLSearchParams(searchParams)
    if (id === 'all') params.delete('category')
    else params.set('category', id)
    setSearchParams(params, { replace: true })
    setCategory(id)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/50">
        <div className="container py-12 sm:py-16">
          <Reveal className="flex flex-col items-start gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
              <ShoppingBag className="h-4 w-4" /> Back home
            </Link>
            <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              The apothecary
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Formulas for energy, stamina and confidence — batch-tested, discreetly delivered.
              Search, filter and add to your bag.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search oil, capsules, drops…"
                aria-label="Search products"
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <LinkButton to="/cart" variant="outline" size="md">
              <ShoppingBag className="h-4 w-4" /> View bag
            </LinkButton>
          </Reveal>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  aria-pressed={isActive}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="products-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-primary-600"
                    />
                  )}
                  <span className="relative z-10">{CATEGORY_LABEL[cat] || cat}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/25 bg-destructive-50 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {loading && visible.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600 mb-3" />
            <p className="text-sm text-muted-foreground">Loading catalogue…</p>
          </div>
        )}
        {visible.length === 0 && !loading && !error && productSource.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">NO products</p>
          </div>
        )}
        {visible.length === 0 && !loading && !error && productSource.length > 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">No matches found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different keyword or category.</p>
            <Button className="mt-6" variant="outline" onClick={() => { setQuery(''); setCategory('all') }}>
              Reset filters
            </Button>
          </div>
        )}
        {visible.length > 0 && (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((product, i) => {
                const mapped = {
                  id: product.productId || product.id,
                  name: product.productName || product.name || 'Product',
                  desc: product.productDescription || product.description || '',
                  price: product.productPrice ?? product.price ?? 0,
                  category: product.productCategory || product.category || 'wellness',
                  rating: product.rating || 4.7,
                  reviews: product.reviews || 0,
                  image: product.productImage || product.image,
                  tag: product.isActive === false ? 'Inactive' : undefined,
                }
                return (
                  <motion.div
                    key={mapped.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.24) }}
                  >
                    <ProductCard product={mapped} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  )
}
