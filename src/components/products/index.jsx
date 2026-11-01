import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Search, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { Button, LinkButton } from '../common/Button'
import { Badge, Card } from '../common/Card'
import { Reveal } from '../common/Reveal'
import { ProductImage } from '../common/ProductImage'
import { CATEGORIES, CATEGORY_LABEL, PRODUCTS } from '../../data/products'
import { ProductCard } from '../landing/Shop'
import { useCart } from '../../context/CartContext'
import { listProducts, getProduct } from '../../services/products'
// import { apiErrorMessage } from '../../services/api'

function useCatalog() {
  const [products, setProducts] = useState(PRODUCTS)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let alive = true
    listProducts()
      .then((data) => {
        if (!alive || !Array.isArray(data) || !data.length) return
        const mapped = data.map((p, i) => ({
          id: p.productId || p.id || String(i),
          name: p.productName || p.name || 'Untitled',
          desc: p.productDescription || p.description || '',
          price: p.productPrice ?? p.price ?? 0,
          category: p.category || PRODUCTS[i % PRODUCTS.length].category,
          rating: p.rating || 4.7,
          image: p.imageUrl || p.image,
          tag: p.tag,
        }))
        setProducts(mapped)
      })
      .catch(() => alive && setOffline(true))
    return () => {
      alive = false
    }
  }, [])

  return { products, offline }
}

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const [query, setQuery] = useState('')
  const { products, offline } = useCatalog()

  const filtered = useMemo(() => {
    const list = category === 'all' ? products : products.filter((p) => p.category === category)
    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter((p) => p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q))
  }, [products, category, query])

  const setCategory = (id) => {
    const params = new URLSearchParams(searchParams)
    if (id === 'all') params.delete('category')
    else params.set('category', id)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/50">
        <div className="container py-12 sm:py-16">
          <Reveal className="flex flex-col items-start gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
            <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              The apothecary
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Every formula below is batch-tested and clearly labelled. Search, filter, and add to
              your bag.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ashwagandha, tulsi, oils…"
                aria-label="Search products"
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <LinkButton to="/cart" variant="outline" size="md">
              <ShoppingBag className="h-4 w-4" /> View bag
            </LinkButton>
          </Reveal>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="products-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-primary-600"
                    />
                  )}
                  <span className="relative z-10">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container py-10">
        {offline && (
          <div className="mb-6 rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 dark:border-secondary-900 dark:bg-secondary-950 dark:text-secondary-200">
            Catalogue API is unreachable — showing sample products.
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">No matches found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different keyword or category.</p>
            <Button className="mt-6" variant="outline" onClick={() => { setQuery(''); setCategory('all') }}>
              Reset filters
            </Button>
          </div>
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.24) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  )
}

export function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [product, setProduct] = useState(() => PRODUCTS.find((p) => p.id === id))
  const [loading, setLoading] = useState(!product)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getProduct(id)
      .then((data) => {
        if (!alive || !data) return
        setProduct({
          id: data.productId || data.id || id,
          name: data.productName || data.name || 'Product',
          desc: data.productDescription || data.description || '',
          price: data.productPrice ?? data.price ?? 0,
          category: data.category || 'wellness',
          rating: data.rating || 4.7,
          reviews: data.reviews || 120,
          image: data.imageUrl || data.image,
        })
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-28 text-center">
        <p className="font-display text-3xl font-semibold text-foreground">Product not found</p>
        <LinkButton to="/products" className="mt-6">Browse the catalogue</LinkButton>
      </div>
    )
  }

  const perks = [
    { icon: Truck, text: 'Ships within 24 hours' },
    { icon: ShieldCheck, text: 'Lab tested, batch verified' },
    { icon: RotateCcw, text: '7-day easy returns' },
  ]

  return (
    <div className="container py-10 sm:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-border bg-muted"
        >
          <ProductImage product={product} className="aspect-square w-full" />
          {product.tag && (
            <Badge variant="secondary" className="absolute left-5 top-5 shadow-sm">{product.tag}</Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5"
        >
          <Badge variant="primary" className="w-fit">{CATEGORY_LABEL[product.category] || product.category}</Badge>
          <h1 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary-400 text-secondary-400" />
              ))}
            </span>
            <span className="font-bold text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">{product.desc}</p>

          <div className="flex items-baseline gap-3 border-t border-border pt-5">
            <span className="font-display text-4xl font-semibold text-foreground">₹{product.price}</span>
            <span className="text-sm text-muted-foreground">Inclusive of all taxes</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border p-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-7 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" onClick={() => add(product, qty)} className="flex-1 sm:flex-none sm:px-8">
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </Button>
            <LinkButton to="/cart" size="lg" variant="outline" className="flex-1 sm:flex-none sm:px-8">
              Checkout
            </LinkButton>
          </div>

          <ul className="grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="h-4.5 w-4.5 shrink-0 text-primary-600 dark:text-primary-400" />
                {text}
              </li>
            ))}
          </ul>

          <Card className="bg-muted/60">
            <p className="text-sm font-semibold text-foreground">How to use</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Follow the dosage on the label, preferably after meals, or as directed by your
              physician. Store in a cool, dry place away from direct sunlight.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
